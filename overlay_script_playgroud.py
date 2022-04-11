# coding: utf-8

import arcpy, os
from arcpy.sa import *

##This code assumes the classification tif files are in same folder as the
##script file

##Get the directory the script file is in.
wd = os.getcwd()
print("Directory is " + wd)
arcpy.env.workspace = wd
arcpy.env.overwriteOutput = True

##if output geodatabase does not exist, creates one in the wd
if not arcpy.Exists(wd + "\\output.gdb"):
    arcpy.CreateFileGDB_management(wd, "\\output.gdb")
    print ("\n","\n", "Geodatabase was created in", wd,"\\output.gdb")

output_path = wd + "\\output.gdb"


##Get the classification files and the cloud mask tifs
S17 = Raster(wd + "\\S1_classification_2017.tif")
L17 = Raster(wd + "\\L8_classification_2017_nourban.tif")

S18 = Raster(wd + "\\S1_classification_2018.tif")
L18 = Raster(wd + "\\L8_classification_2018_nourban.tif")
c18 = Raster(wd + "\\constant18.tif")

S19 = Raster(wd + "\\S1_classification_2019.tif")
L19 = Raster(wd + "\\L8_classification_2019_nourban.tif")
c19 = Raster(wd + "\\constant19.tif")

S20 = Raster(wd + "\\S1_classification_2020.tif")
L20 = Raster(wd + "\\L8_classification_2020_nourban.tif")
c20 = Raster(wd + "\\constant20.tif")

S21 = Raster(wd + "\\S1_classification_2021.tif")
L21 = Raster(wd + "\\L8_classification_2021_nourban.tif")
c21 = Raster(wd + "\\constant21.tif")
cloud = Raster(wd + "\\21_cloudmask.tif")

##If the pixel is overlayed by cloud buffer pixel, use S1 pixel.
##Otherwise, use L8 pixel.
OutCon17 = Con(S17 == L17, L17, L17)
OutCon18 = Con(c18 == 0, L18, S18)
OutCon19 = Con(c19 == 0, L19, S19)
OutCon20 = Con(c20 == 0, L20, S20)
OutCon21 = Con(((c21 == 0) & (cloud == 1)), L21, S21)

##Save the outputs in the geodatabase
OutCon17.save(output_path + "\\Con_result_mask17_nourban")
OutCon18.save(output_path + "\\Con_result_mask18_nourban")
OutCon19.save(output_path + "\\Con_result_mask19_nourban")
OutCon20.save(output_path + "\\Con_result_mask20_nourban")
OutCon21.save(output_path + "\\Con_result_mask21_nourban")
