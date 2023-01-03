navigator.geolocation.getCurrentPosition(
  (pos) => {
    document.getElementById("latitude").value = pos.coords.latitude;
    document.getElementById("longitude").value = pos.coords.longitude;
    document.getElementById("sub_btn").click();
  },
  () => {
    window.alert("Please Allow Location Access to proceed");
  }
);
