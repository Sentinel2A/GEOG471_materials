/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var Sentinel1 = ee.ImageCollection("COPERNICUS/S1_GRD"),
    Study_area = ee.FeatureCollection("users/choodavi608/Amazon_StudyArea_Rough"),
    histRegion = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-54.06838268790823, -4.132008277907974],
          [-54.06838268790823, -4.139798530086612],
          [-54.05979961906058, -4.139798530086612],
          [-54.05979961906058, -4.132008277907974]]], null, false),
    fin_study_area = ee.FeatureCollection("users/choodavi608/Final_study_area");
/***** End of imports. If edited, may not auto-convert in the playground. *****/
//Gather the landsat images over the study area
//2017 was omitted because upon running the code, the result returned
//nothing, meaning that no cloud was detected in 2017 image.
var image18 = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_227063_20180721').clip(fin_study_area)
var image19 = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_227063_20190724').clip(fin_study_area)
var image20 = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_227063_20200726').clip(fin_study_area)
var image21 = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_227063_20210729').clip(fin_study_area)

Map.addLayer(image18, {bands: ['B4','B3','B2'], min: 0, max: 0.25, gamma:[1.1,1.1,1]}, 'rgb');
//Create the cloud buffer for 2018 Landsat
var scored18 = ee.Algorithms.Landsat.simpleCloudScore(image18);
var mask30_18 = scored18.select(['cloud']).lte(15);

//Create a constant raster image of 1 and edge detector of cloud masks for 2018
var constant18 = ee.Image.constant(1).clip(fin_study_area)
var canny18 = ee.Algorithms.CannyEdgeDetector(mask30_18, 0, 2);
canny18 = canny18.updateMask(canny18);

// Buffer the cloud mask's edges by 15 pixels
var bufferSize = 15
var edgeBuffer18 = canny18.focal_max(bufferSize, 'square', 'pixels'); 
Map.addLayer(edgeBuffer18.updateMask(edgeBuffer18),{},'Buffered Edges');

//Final buffer raster, where it equals 1 on cloud buffer, and 0 where buffer
//does not apply
constant18 = constant18.updateMask(edgeBuffer18).clip(fin_study_area);
Map.addLayer(constant18,  {}, 'constant');

//Repeat process for 2019=========
Map.addLayer(image19, {bands: ['B4','B3','B2'], min: 0, max: 0.25, gamma:[1.1,1.1,1]}, 'rgb19');
var scored19 = ee.Algorithms.Landsat.simpleCloudScore(image19);
var mask30_19 = scored19.select(['cloud']).lte(15);

var constant19 = ee.Image.constant(1).clip(fin_study_area)
var canny19 = ee.Algorithms.CannyEdgeDetector(mask30_19, 0, 2);
canny19 = canny19.updateMask(canny19);

var edgeBuffer19 = canny19.focal_max(bufferSize, 'square', 'pixels'); 
Map.addLayer(edgeBuffer19.updateMask(edgeBuffer19),{},'Buffered Edges19');

constant19 = constant19.updateMask(edgeBuffer19).clip(fin_study_area);
Map.addLayer(constant19,  {}, 'constant19');

//Repeat process for 2020----------
Map.addLayer(image20, {bands: ['B4','B3','B2'], min: 0, max: 0.25, gamma:[1.1,1.1,1]}, 'rgb20');
var scored20 = ee.Algorithms.Landsat.simpleCloudScore(image20);
var mask30_20 = scored20.select(['cloud']).lte(15);

var constant20 = ee.Image.constant(1).clip(fin_study_area)
var canny20 = ee.Algorithms.CannyEdgeDetector(mask30_20, 0, 2);
canny20 = canny20.updateMask(canny20);

var edgeBuffer20 = canny20.focal_max(bufferSize, 'square', 'pixels'); 
Map.addLayer(edgeBuffer20.updateMask(edgeBuffer20),{},'Buffered Edges20');

constant20 = constant20.updateMask(edgeBuffer20).clip(fin_study_area);
Map.addLayer(constant20,  {}, 'constant20');

//Repeat process for 2021-------
Map.addLayer(image21, {bands: ['B4','B3','B2'], min: 0, max: 0.25, gamma:[1.1,1.1,1]}, 'rgb21');
var scored21 = ee.Algorithms.Landsat.simpleCloudScore(image21);
var mask30_21 = scored21.select(['cloud']).lte(15);

var constant21 = ee.Image.constant(1).clip(fin_study_area)
var clouds21 = image21.updateMask(mask30_21);
var cloud21_mask = image21.mask(mask30_21);

Map.addLayer(mask30_21,{}, 'cloudmask')
var canny21 = ee.Algorithms.CannyEdgeDetector(mask30_21, 0, 2);
canny21 = canny21.updateMask(canny21);

var edgeBuffer21 = canny21.focal_max(bufferSize, 'square', 'pixels'); 
Map.addLayer(edgeBuffer21.updateMask(edgeBuffer21),{},'Buffered Edges21');

//In 2021, there were some areas that were not covered by cloud edge buffers
//Seperate image of cloud mask was exported for 2021
constant21 = constant21.updateMask(edgeBuffer21).clip(fin_study_area);
Map.addLayer(constant21,  {}, 'constant21');

//Export all the results to the drive
Export.image.toDrive({
  image: constant18,
  description: 'constant18',
  region: fin_study_area,
  scale:30,
  crs:"EPSG:4326",
  fileFormat: 'GeoTIFF'
})

Export.image.toDrive({
  image: constant19,
  description: 'constant19',
  region: fin_study_area,
  scale:30,
  crs:"EPSG:4326",
  fileFormat: 'GeoTIFF'
})

Export.image.toDrive({
  image: constant20,
  description: 'constant20',
  region: fin_study_area,
  scale:30,
  crs:"EPSG:4326",
  fileFormat: 'GeoTIFF'
})

Export.image.toDrive({
  image: constant21,
  description: 'constant21',
  region: fin_study_area,
  scale:30,
  crs:"EPSG:4326",
  fileFormat: 'GeoTIFF'
})

Export.image.toDrive({
  image: mask30_21,
  description: '21_cloudmask',
  region: fin_study_area,
  scale:30,
  crs:"EPSG:4326",
  fileFormat: 'GeoTIFF'
})