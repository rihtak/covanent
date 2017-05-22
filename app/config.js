var US_CENTER_LAT_LNG = { lat: 36.090240, lng: -95.712891 };
var DEFAULT_ZOOM_LEVEL = 4;
var OVER_HEAT_TEMPERATURE = 200;
var ENGINE_ON = 1,ENGINE_ON_STRING="Running";
var ENGINE_OFF = 0,ENGINE_OFF_STRING = "Idle";
/*REFRESHING INTERVAL IN MINUTES */
var REFRESHING_INTERVAL = 0.5;
var MACHINE_DROPDOWN_THRESHOLD = 10;
var MINIMUM_MACHINE_COUNT = 300;
/*Marker Image Path*/
var runningImage = "app/images/markers/red-truck.png";
var idleImage = "app/images/markers/green-truck.png";
var overHeatImage = "app/images/markers/green-truck.png";
var allotedTruckImage = "app/images/markers/alloted-truck.png";
var pllanedTruckImage = "app/images/markers/planned-truk.png";
var availableTruckImage = "app/images/markers/available-truck.png";

var AVAILABLE_STATUS = 0;
var PLANNED_STATUS = 1;
var ALLOTED_STATUS = 2;

/*Cluster Prefix remove the index*/

var runningClusterImage = "app/images/markers/running";
var idleClusterImage = "app/images/markers/move-";
var overHeatClusterImage = "app/images/markers/idle";

/*URL*/
var IOT_BASE_URL =  "http://52.14.203.215:8080/iothbase"; //"http://10.4.4.132/iothbase";
var GET_LIST_OF_ORDERS_URL =  "app/data/list_of_orders.json"; 
var GET_AVAILABLE_TRAILERS_URL = "app/data/available_trailers.json";
var GET_TRACTOR_LOCATOR_URL ="app/data/trailerLocator.json";
var GET_TRAILER_HISTORY = "app/data/orderHistory.json"
//var AD_HOC_REPORT_URL = "app/data/output2.json";
var RECENT_ALERT_URL = IOT_BASE_URL + "/api/v1/iothbase/gethivealertdata"; // (7days and temparature above 200)
var DETAILED_INFO_ABOUT_MACHINE_URL = IOT_BASE_URL + "/api/v1/iothbase/gethivedetaildata"
var DETAILED_INFO_ABOUT_RECENT_MACHINE_URL = IOT_BASE_URL + "/api/v1/iothbase/gethivealertdetaildata"

var MAP_DATA_URL = "app/data/StreamingData/part-00000";
var SIMULATOR_BASE_URL = "http://52.14.203.215:8080/iotweb/api/v1";//"http://10.4.4.132/iotweb/api/v1";

var USER_EMAIL = "admin@dminc.com"
var USER_PASSWORD = "DMI@!5y"

var SIMULATOR_USE_CASES = [{
    "id":1,
    "name":"Usecase 1"
},{
    "id":2,
    "name":"Usecase 2"
}];

/*Rules*/
//Due in 10 days
//Temperature
var DUE_10_TEMPERATURE = 158;
//Engine Noise
var DUE_10_NOISE = 75;

//Due in 20 Days
//Temperature
var DUE_20_TEMPERATURE_MAX = 158;
var DUE_20_TEMPERATURE_MIN = 135;
//Engine Noise
var DUE_20_NOISE_MAX = 75;
var DUE_20_NOISE_MIN = 50;

//Due in 30 Days
//Temperature
var DUE_30_TEMPERATURE_MAX = 135;
var DUE_30_TEMPERATURE_MIN = 110;
//Engine Noise
var DUE_30_NOISE_MAX = 50;
var DUE_30_NOISE_MIN = 30;

function getRangeLines(status){
    switch(status)
    {
        case 10:
           return  [{value: DUE_10_TEMPERATURE, text: 'Temperature '+DUE_10_TEMPERATURE, position: 'start'},
                    {value: DUE_10_NOISE, text: 'Engine Noise  '+DUE_10_NOISE, position: 'end' }]
        case 20:
           return  [{value: DUE_20_TEMPERATURE_MAX, text: 'Temperature '+DUE_20_TEMPERATURE_MAX, position: 'start'},
                    {value: DUE_20_TEMPERATURE_MIN, text: 'Temperature '+DUE_20_TEMPERATURE_MIN, position: 'start'},
                    {value: DUE_20_NOISE_MAX, text: 'Engine Noise  '+DUE_20_NOISE_MAX, position: 'end' },
                    {value: DUE_20_NOISE_MIN, text: 'Engine Noise  '+DUE_20_NOISE_MIN, position: 'end' }]
         case 30:
           return  [{value: DUE_30_TEMPERATURE_MAX, text: 'Temperature '+DUE_30_TEMPERATURE_MAX, position: 'start'},
                    {value: DUE_30_TEMPERATURE_MIN, text: 'Temperature '+DUE_30_TEMPERATURE_MIN, position: 'start'},
                    {value: DUE_30_NOISE_MAX, text: 'Engine Noise  '+DUE_30_NOISE_MAX, position: 'end' },
                    {value: DUE_30_NOISE_MIN, text: 'Engine Noise  '+DUE_30_NOISE_MIN, position: 'end' }]
    }
}

function formatDate(s){
      var hours = s.getHours();
                // Minutes part from the timestamp
                var minutes = "0" + s.getMinutes();
                // Seconds part from the timestamp
                var seconds = "0" + s.getSeconds();
                var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
     return    s.getDate()+ "-" +(s.getMonth()+1) +"-"+s.getFullYear()+" "+formattedTime
}
var sampleData = [
  {
    "mDate": 1493365761979,
    "rowid": 222,
    "temperature": 136,
    "noise": 53,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493399504813,
    "rowid": 222,
    "temperature": 185,
    "noise": 64,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493429967811,
    "rowid": 222,
    "temperature": 110,
    "noise": 84,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493438170012,
    "rowid": 222,
    "temperature": 143,
    "noise": 81,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493456510252,
    "rowid": 222,
    "temperature": 159,
    "noise": 79,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493469540356,
    "rowid": 222,
    "temperature": 142,
    "noise": 42,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493511499177,
    "rowid": 222,
    "temperature": 125,
    "noise": 46,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493546371149,
    "rowid": 222,
    "temperature": 191,
    "noise": 62,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493575790754,
    "rowid": 222,
    "temperature": 181,
    "noise": 88,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493578228427,
    "rowid": 222,
    "temperature": 152,
    "noise": 50,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493664301343,
    "rowid": 222,
    "temperature": 202,
    "noise": 71,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493665178455,
    "rowid": 222,
    "temperature": 187,
    "noise": 39,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493668120547,
    "rowid": 222,
    "temperature": 162,
    "noise": 75,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493692278003,
    "rowid": 222,
    "temperature": 160,
    "noise": 70,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493699169366,
    "rowid": 222,
    "temperature": 121,
    "noise": 57,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493703721064,
    "rowid": 222,
    "temperature": 179,
    "noise": 83,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493746134668,
    "rowid": 222,
    "temperature": 115,
    "noise": 86,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493821200775,
    "rowid": 222,
    "temperature": 205,
    "noise": 82,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493822235034,
    "rowid": 222,
    "temperature": 146,
    "noise": 88,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493839907834,
    "rowid": 222,
    "temperature": 204,
    "noise": 64,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493866845134,
    "rowid": 222,
    "temperature": 142,
    "noise": 35,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493867360626,
    "rowid": 222,
    "temperature": 126,
    "noise": 58,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493887734190,
    "rowid": 222,
    "temperature": 139,
    "noise": 51,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493902844011,
    "rowid": 222,
    "temperature": 186,
    "noise": 64,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493937363795,
    "rowid": 222,
    "temperature": 154,
    "noise": 90,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493942058325,
    "rowid": 222,
    "temperature": 187,
    "noise": 57,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493947402911,
    "rowid": 222,
    "temperature": 133,
    "noise": 66,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1493947889569,
    "rowid": 222,
    "temperature": 206,
    "noise": 90,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494034176715,
    "rowid": 222,
    "temperature": 130,
    "noise": 59,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494038373002,
    "rowid": 222,
    "temperature": 128,
    "noise": 72,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494084007450,
    "rowid": 222,
    "temperature": 209,
    "noise": 82,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494085692479,
    "rowid": 222,
    "temperature": 163,
    "noise": 87,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494103334027,
    "rowid": 222,
    "temperature": 207,
    "noise": 65,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494119121698,
    "rowid": 222,
    "temperature": 165,
    "noise": 57,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494166658539,
    "rowid": 222,
    "temperature": 209,
    "noise": 39,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494179077309,
    "rowid": 222,
    "temperature": 139,
    "noise": 51,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494204183448,
    "rowid": 222,
    "temperature": 155,
    "noise": 59,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494253168899,
    "rowid": 222,
    "temperature": 148,
    "noise": 80,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494314077882,
    "rowid": 222,
    "temperature": 187,
    "noise": 56,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494347603837,
    "rowid": 222,
    "temperature": 182,
    "noise": 72,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494409782227,
    "rowid": 222,
    "temperature": 121,
    "noise": 77,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494415574705,
    "rowid": 222,
    "temperature": 122,
    "noise": 86,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494537512154,
    "rowid": 222,
    "temperature": 180,
    "noise": 53,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494568744316,
    "rowid": 222,
    "temperature": 124,
    "noise": 53,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494621997543,
    "rowid": 222,
    "temperature": 117,
    "noise": 84,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494625994243,
    "rowid": 222,
    "temperature": 170,
    "noise": 79,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494684733748,
    "rowid": 222,
    "temperature": 149,
    "noise": 51,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494722439510,
    "rowid": 222,
    "temperature": 172,
    "noise": 74,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494745879347,
    "rowid": 222,
    "temperature": 180,
    "noise": 68,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494748905534,
    "rowid": 222,
    "temperature": 119,
    "noise": 72,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494770936039,
    "rowid": 222,
    "temperature": 171,
    "noise": 76,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494791918036,
    "rowid": 222,
    "temperature": 143,
    "noise": 66,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494793903599,
    "rowid": 222,
    "temperature": 188,
    "noise": 75,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494830135129,
    "rowid": 222,
    "temperature": 161,
    "noise": 89,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494899816067,
    "rowid": 222,
    "temperature": 133,
    "noise": 90,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494905029726,
    "rowid": 222,
    "temperature": 117,
    "noise": 43,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494921634474,
    "rowid": 222,
    "temperature": 156,
    "noise": 82,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494939235918,
    "rowid": 222,
    "temperature": 155,
    "noise": 66,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1494952895003,
    "rowid": 222,
    "temperature": 157,
    "noise": 90,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  },
  {
    "mDate": 1495023314619,
    "rowid": 222,
    "temperature": 157,
    "noise": 82,
    "Battery": 25,
    "latitude": 43.32013969,
    "longitude": -120.2330159,
    "EngineOn": 1
  }
];
var recentData = [{"rowid":10,"latitude":31.34978103,"longitude":-82.63160898,"noise":22.0,"noise30btw50":0,"noise50btw75":0,"noise75Above":0,"temperature":220.0,"temperature110btw135":0,"temperature135btw158":0,"temperature158Above":0,"status":null,"statusVal":0,"mDate":"2017-05-04 05:32:53","count":0},{"rowid":10,"latitude":33.17169209,"longitude":-80.7284979,"noise":21.0,"noise30btw50":0,"noise50btw75":0,"noise75Above":0,"temperature":214.0,"temperature110btw135":0,"temperature135btw158":0,"temperature158Above":0,"status":null,"statusVal":0,"mDate":"2017-05-03 05:37:33","count":0}];

var allocationData = [];
var trailerData = [{"status":"Completed","orderID":"","trailerId":"1234","tracktor":"33331","destinationcity":"Ontoria OH","service":"TEAM","priorevent":"LUL","gpsloc":"2 m S of dalton ,GA","next":"unplanned","availabledate":"23-7-2017 12:04","details":"more info","nextEvent":"UNK"},
                     {"status":"Completed","orderID":"","trailerId":"1235","tracktor":"33332","destinationcity":"BUFORD,GA","service":"TEAM","priorevent":"LUL","gpsloc":"2 m S of dalton ,GA","next":"unplanned","availabledate":"23-7-2017 12:04","details":"more info","nextEvent":"UNK"},
                     {"status":"Completed","orderID":"","trailerId":"1236","tracktor":"33333","destinationcity":"BUFORD,GA","service":"TEAM","priorevent":"LUL","gpsloc":"2 m S of dalton ,GA","next":"unplanned","availabledate":"23-7-2017 12:04","details":"more info","nextEvent":"UNK"}];

var statesjson = {"KMAE":[-120.12,36.98,"MADERA MUNICIPAL AIRPORT",[26,1,2,5,6,3,2,1,2,7,29,12,3]]}
