var express = require("express");
var router = express.Router();

const {
  Dropdown,
  ProvinceView,
  DistrictViewByProvinceId,
  VillageViewByDistrictId,
} = require("../controller/common/common_controller");

router.get("/dropdown", Dropdown);
router.get("/province", ProvinceView);
router.get("/district/:provinceId", DistrictViewByProvinceId);
router.get("/village/:districtId", VillageViewByDistrictId);

module.exports = router;
