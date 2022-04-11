//Skip to line 87 for codes
/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var final_study_Area = ee.FeatureCollection("users/choodavi608/Final_study_area"),
    S1_2019 = ee.Image("users/choodavi608/S1_2019_30m"),
    S1_2020 = ee.Image("users/choodavi608/S1_2020_30m"),
    geometry = 
    /* color: #3dc26f */
    /* displayProperties: [
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      },
      {
        "type": "rectangle"
      }
    ] */
    ee.Feature(
        ee.Geometry.MultiPolygon(
            [[[[-54.8434947042153, -3.8381823883167225],
               [-54.8434947042153, -3.840751529767979],
               [-54.84014730736472, -3.840751529767979],
               [-54.84014730736472, -3.8381823883167225]]],
             [[[-55.08424978539206, -3.8831412433007446],
               [-55.08424978539206, -3.885624615280758],
               [-55.08133154198386, -3.885624615280758],
               [-55.08133154198386, -3.8831412433007446]]],
             [[[-55.28457861229636, -3.931009086609562],
               [-55.28457861229636, -3.9336635738351062],
               [-55.28123121544577, -3.9336635738351062],
               [-55.28123121544577, -3.931009086609562]]],
             [[[-55.16999464318015, -4.3036651325576445],
               [-55.16999464318015, -4.306489553582867],
               [-55.167505553214326, -4.306489553582867],
               [-55.167505553214326, -4.3036651325576445]]],
             [[[-54.95292883202292, -4.542333839346242],
               [-54.95292883202292, -4.54532847170072],
               [-54.94975309654929, -4.54532847170072],
               [-54.94975309654929, -4.542333839346242]]],
             [[[-54.556047728507295, -4.511360056791852],
               [-54.556047728507295, -4.515467153857044],
               [-54.55192785546042, -4.515467153857044],
               [-54.55192785546042, -4.511360056791852]]],
             [[[-54.47571020409323, -4.435888034872712],
               [-54.47571020409323, -4.439653262918791],
               [-54.47159033104636, -4.439653262918791],
               [-54.47159033104636, -4.435888034872712]]],
             [[[-54.02528195372358, -4.388478753835447],
               [-54.02528195372358, -4.392244222385044],
               [-54.021848726184515, -4.392244222385044],
               [-54.021848726184515, -4.388478753835447]]],
             [[[-54.16209607115522, -4.141286320723056],
               [-54.16209607115522, -4.145566638388184],
               [-54.15831952086225, -4.145566638388184],
               [-54.15831952086225, -4.141286320723056]]],
             [[[-54.02692348149305, -4.118867668633694],
               [-54.02692348149305, -4.122976890193819],
               [-54.021773640184456, -4.122976890193819],
               [-54.021773640184456, -4.118867668633694]]]], null, false),
        {
          "land": 0,
          "system:index": "0"
        }),
    image = ee.Image("users/choodavi608/S1_2017_focal_alt"),
    image2 = ee.Image("users/choodavi608/S1_2017_focal");
/***** End of imports. If edited, may not auto-convert in the playground. *****/

var parameter = {//1. Data Selection
              START_DATE: "2021-07-22",
              STOP_DATE: "2021-07-29",
              POLARIZATION:'VVVH',
              ORBIT : 'BOTH',
              GEOMETRY: final_study_Area, //uncomment if interactively selecting a region of interest
              //GEOMETRY: ee.Geometry.Polygon([[[104.80, 11.61],[104.80, 11.36],[105.16, 11.36],[105.16, 11.61]]], null, false), //Uncomment if providing coordinates
              //GEOMETRY: ee.Geometry.Polygon([[[112.05, -0.25],[112.05, -0.45],[112.25, -0.45],[112.25, -0.25]]], null, false),
              //2. Additional Border noise correction
              APPLY_ADDITIONAL_BORDER_NOISE_CORRECTION: true,
              //3.Speckle filter
              APPLY_SPECKLE_FILTERING: true,
              SPECKLE_FILTER_FRAMEWORK: 'MULTI',
              SPECKLE_FILTER: 'LEE',
              SPECKLE_FILTER_KERNEL_SIZE: 5,
              SPECKLE_FILTER_NR_OF_IMAGES: 10,
              //4. Radiometric terrain normalization
              APPLY_TERRAIN_FLATTENING: true,
              DEM: ee.Image('USGS/SRTMGL1_003'),
              TERRAIN_FLATTENING_MODEL: 'VOLUME',
              TERRAIN_FLATTENING_ADDITIONAL_LAYOVER_SHADOW_BUFFER: 0,
              //5. Output
              FORMAT : 'DB',
              CLIP_TO_ROI: false,
              SAVE_ASSETS: false
}

//---------------------------------------------------------------------------//
// DO THE JOB
//---------------------------------------------------------------------------//
      
var wrapper = require('users/adugnagirma/gee_s1_ard:wrapper');
var helper = require('users/adugnagirma/gee_s1_ard:utilities');
//Preprocess the S1 collection
var s1_preprocces = wrapper.s1_preproc(parameter);

var s1 = s1_preprocces[0]
s1_preprocces = s1_preprocces[1]



//---------------------------------------------------------------------------//
// EXPORT
//---------------------------------------------------------------------------//

//Convert format for export
if (parameter.FORMAT=='DB'){
  s1_preprocces = s1_preprocces.map(helper.lin_to_db);
}

//Save processed collection to asset
if(parameter.SAVE_ASSETS) {
helper.Download.ImageCollection.toAsset(s1_preprocces, '', 
               {scale: 10, 
               region: s1_preprocces.geometry(),
                type: 'float'})
}
print(s1_preprocces)
var vvVhIw = s1_preprocces
  // Filter to get images with VV and VH dual polarization.
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
  // Filter to get images collected in interferometric wide swath mode.
  .filter(ee.Filter.eq('instrumentMode', 'IW')).select('VV');
  
var vvVhIw_2 = s1_preprocces
  // Filter to get images with VV and VH dual polarization.
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
  // Filter to get images collected in interferometric wide swath mode.
  .filter(ee.Filter.eq('instrumentMode', 'IW')).select('VH');
  
var mosaic = vvVhIw.median().clip(final_study_Area);
var mosaic_2 = vvVhIw_2.median().clip(final_study_Area);

Map.addLayer(mosaic, {bands: 'VV', min:-18, max:1}, "testing");
Map.addLayer(mosaic_2, {bands: 'VH', min:-18, max:1}, "testing2");

var class_image = s1_preprocces
  // Filter to get images with VV and VH dual polarization.
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  // Filter to get images collected in interferometric wide swath mode.
;

var VV = class_image.select('VV');
var VH = class_image.select('VH');

var NL = class_image.map(function (image) {
  var VV = image.select('VV');
  var VH = image.select('VH');
  var n = (VV.multiply(VH)).divide(VV.add(VH));
  return n.rename('NL');
})


class_image = class_image.combine(NL);
print(class_image)
//class_image = class_image.addBands(NL);

//Map.addLayer(class_image, {bands: ['VV','VH','CR'], min: -22, max: 50}, "testing3");

class_image = class_image.mosaic().clip(final_study_Area);
class_image = class_image.focalMedian(3,'square','pixels',1);
class_image = class_image.clip(final_study_Area);
var bands = ['VV','VH','NL'];
Map.addLayer(class_image, {bands: ['VV'], min: -18, max:1}, "testing3")

Export.image.toAsset({
  image: class_image,
  description: 'S1_2021_export',
  assetId: 'S1_2021_focal',
  region: final_study_Area,
  scale:30,
  crs:"EPSG:4326"
});

Map.addLayer(image, {bands: 'VV', min:-18, max:1}, "2017");
Map.addLayer(image2, {bands: 'VV', min:-18, max:1}, "2017_old");
Map.addLayer(S1_2019, {bands: 'VV', min:-18, max:1}, "2019");
Map.addLayer(S1_2020, {bands: 'VV', min:-18, max:1}, "2020");