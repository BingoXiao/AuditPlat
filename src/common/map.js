// JavaScript Document（百度地图API调用）
function G(id) {
  return document.getElementById(id);
}

// 百度地图API功能
var map = new BMap.Map("allmap");
var point = new BMap.Point(113.897649, 22.49876);
//var myGeo = new BMap.Geocoder();

map.centerAndZoom(point,50);
var geoc = new BMap.Geocoder();
var marker = new BMap.Marker(point);  // 创建标注

// function myFun(result) {
//     var cityName = result.name;
//     map.setCenter(cityName);
//     // alert("当前定位城市:"+cityName);
// }
//
//var myCity = new BMap.LocalCity();
// myCity.get(myFun);


map.addEventListener("click", function (e) {
  var pt = e.point;
  geoc.getLocation(pt, function (rs) {
    var addComp = rs.addressComponents;

    /*display(addComp.district,"province");//同步省
     display(addComp.district,"city");//同步市
     display(addComp.district, "district");//同步区
     document.getElementById('area').value=addComp.province;*/
    if (addComp.city != "深圳市") {
      alert("抱歉！目前仅支持选择深圳地区！");
      exit();
    }
    else {//创建一个跳动的红点
      var marker = new BMap.Marker(pt);

      map.clearOverlays();
      map.addOverlay(marker);

      marker.setAnimation(BMAP_ANIMATION_BOUNCE);

      // 将地址解析结果显示在地图上
      document.getElementById('position').value = pt.lng + "," + pt.lat;

      //移除错误标志
      $("#address").removeClass("errorInput");
      $("#position").removeClass("errorInput");
      $("#pointError").css("display", "none");

    }
    //document.getElementById('address').value = addComp.province + addComp.city + addComp.district + addComp.street + addComp.streetNumber;
    //document.getElementById('address').value = addComp.street + addComp.streetNumber;

  });
});

var local = new BMap.LocalSearch(map, {
  renderOptions: {map: map}
});


//根据具体地址搜索位置
function local_address() {
  var address = document.getElementById("province").options[document.getElementById("province").selectedIndex].text
    + document.getElementById("city").options[document.getElementById("city").selectedIndex].text
    + document.getElementById("district").options[document.getElementById("district").selectedIndex].text
    + document.getElementById('address').value;

  local.search(address);

}

//根据提供的坐标点显示位置
function showLocal(po) {
  var str = po.split(',');
  var new_point = new BMap.Point(str[0], str[1]);
  var marker = new BMap.Marker(new_point);  // 创建标注

  map.clearOverlays();
  map.panTo(new_point);
  map.addOverlay(marker);       // 将标注添加到地图中
}

/*function display(optionValue, address) {
 var all_options = document.getElementById(address).options;
 for (i = 0; i < all_options.length; i++) {
 if (all_options[i].value == optionValue)  // 根据option标签的ID来进行判断  测试的代码这里是两个等号
 {
 all_options[i].selected = true;
 }
 }
 };


 map.centerAndZoom(new BMap.Point(116.4035,39.915),9); //设置放大级别
 setTimeout(function(){
 map.setZoom(13);
 }, 2000);  //2秒后放大到14级*/
//========================关键字输入提示====================================
/*var ac = new BMap.Autocomplete(    //建立一个自动完成的对象
 {
 "input": "address"
 , "location": map
 });

 ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
 var str = "";
 var _value = e.fromitem.value;
 var value = "";
 if (e.fromitem.index > -1) {
 value = _value.province + _value.city + _value.district + _value.street + _value.business;
 }
 str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

 value = "";
 if (e.toitem.index > -1) {
 _value = e.toitem.value;
 value = _value.province + _value.city + _value.district + _value.street + _value.business;
 }
 str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
 G("searchResultPanel").innerHTML = str;
 });

 var myValue;
 ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
 var _value = e.item.value;
 myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
 G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

 setPlace();
 });

 function setPlace() {
 map.clearOverlays();    //清除地图上所有覆盖物
 function myFun() {
 var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
 map.centerAndZoom(pp, 18);
 map.addOverlay(new BMap.Marker(pp));    //添加标注
 }

 var local = new BMap.LocalSearch(map, { //智能搜索
 onSearchComplete: myFun
 });

 local.search(myValue);

 }*/

