(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./$$_lazy_route_resource lazy recursive":
/*!******************************************************!*\
  !*** ./$$_lazy_route_resource lazy namespace object ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html":
/*!**************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n<router-outlet></router-outlet>\n\n<!-- CSS only -->\n<link rel=\"stylesheet\" href=\"https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css\"\n      integrity=\"sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk\" crossorigin=\"anonymous\">\n\n<!-- JS, Popper.js, and jQuery -->\n<script src=\"https://code.jquery.com/jquery-3.5.1.slim.min.js\"\n        integrity=\"sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj\"\n        crossorigin=\"anonymous\"></script>\n<script src=\"https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js\"\n        integrity=\"sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo\"\n        crossorigin=\"anonymous\"></script>\n<script src=\"https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js\"\n        integrity=\"sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI\"\n        crossorigin=\"anonymous\"></script>\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/create-deployment/create-deployment.component.html":
/*!*********************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/components/create-deployment/create-deployment.component.html ***!
  \*********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<p>create-deployment works!</p>\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/deployments/deployments.component.html":
/*!*********************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/components/deployments/deployments.component.html ***!
  \*********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"row m-1\">\n  <div class=\"col\">\n    <div class=\"m-5\">\n      <div *ngIf=\"creating == false\">\n        <button type=\"button\" class=\"btn btn-outline-primary\" (click)=\"switchCreating()\">+</button>\n      </div>\n      <div *ngIf=\"creating == true\">\n        <button type=\"button\" class=\"btn btn-outline-danger\" (click)=\"switchCreating()\"> -</button>\n        <form (submit)=\"createDeployment()\">\n          <div class=\"form-group\">\n            <label for=\"deploymentName\">Deployment name</label>\n            <input [(ngModel)]=\"newdep.name\" name=\"name\" type=\"text\" class=\"form-control\" id=\"deploymentName\"\n                   placeholder=\"Enter deployment name\">\n          </div>\n          <button type=\"submit\" class=\"btn btn-primary\">Create Deloyment</button>\n        </form>\n\n      </div>\n      <div *ngIf=\"deployments && deployments.length == 0\">\n        <p>There are no deployments yet!</p>\n      </div>\n    </div>\n    <h3>Not yet deployed</h3>\n    <div *ngFor=\"let deployment of deployments\">\n      <div *ngIf=\"deployment.status == 'pending'\">\n      <a (click)=\"navigateToEdit(deployment._id)\">\n        <div class=\"deployment-div mb-4\">\n          <div class=\"row m-3\">\n            <div class=\"col-8\">\n              <h4>{{deployment.name}}</h4>\n            </div>\n            <div class=\"col-8\">\n              <p>{{deployment.description}}</p>\n            </div>\n            <div class=\"col-5\">\n              <small>tags</small>\n            </div>\n            <div class=\"col-4\">\n\n            </div>\n          </div>\n        </div>\n      </a>\n      </div>\n    </div>\n\n    <h3>Deployed</h3>\n    <div *ngFor=\"let deployment of deployments\">\n      <div *ngIf=\"deployment.status == 'deployed'\">\n        <a (click)=\"navigateToReview(deployment._id)\">\n          <div class=\"deployment-div mb-4\">\n            <div class=\"row m-3\">\n              <div class=\"col-8\">\n                <h4>{{deployment.name}}</h4>\n              </div>\n              <div class=\"col-8\">\n                <p>{{deployment.description}}</p>\n              </div>\n              <div class=\"col-5\">\n                <small>tags</small>\n              </div>\n              <div class=\"col-4\">\n\n              </div>\n            </div>\n          </div>\n        </a>\n      </div>\n    </div>\n\n\n\n    <h3>Finished</h3>\n    <div *ngFor=\"let deployment of deployments\">\n      <div *ngIf=\"deployment.status == 'finished'\">\n        <a (click)=\"navigateToEdit(deployment._id)\">\n          <div class=\"deployment-div mb-4\">\n            <div class=\"row m-3\">\n              <div class=\"col-8\">\n                <h4>{{deployment.name}}</h4>\n              </div>\n              <div class=\"col-8\">\n                <p>{{deployment.description}}</p>\n              </div>\n              <div class=\"col-5\">\n                <small>tags</small>\n              </div>\n              <div class=\"col-4\">\n\n              </div>\n            </div>\n          </div>\n        </a>\n      </div>\n    </div>\n\n  </div>\n</div>\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/edit-deployment/edit-deployment.component.html":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/components/edit-deployment/edit-deployment.component.html ***!
  \*****************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div *ngIf=\"deployment\">\n  <h2>{{deployment.name}}</h2>\n  <div class=\"deployment-div m-3\">\n    <div class=\"m-2\">\n      <form (submit)=\"saveChangesForm()\">\n        <div class=\"form-group\">\n          <label for=\"deploymentName\">Deployment name</label>\n          <input [(ngModel)]=\"depDTO.name\" name=\"name\" type=\"text\" class=\"form-control\" id=\"deploymentName\"\n                 placeholder=\"Enter deployment name\">\n        </div>\n        <div class=\"form-group\">\n          <label for=\"deploymentDescription\">Deployment description</label>\n          <input [(ngModel)]=\"depDTO.description\" name=\"deploymentDescription\" type=\"textarea\" class=\"form-control\"\n                 id=\"deploymentDescription\" placeholder=\"Enter deployment description\">\n        </div>\n        <button type=\"submit\" class=\"btn btn-primary mr-4\">Save Changes</button>\n        <button (click)=\"discardChanges()\" class=\"btn btn-danger\">Discard Changes</button>\n      </form>\n    </div>\n  </div>\n</div>\n\n<div class=\"deployment-div m-3\">\n  <div class=\"m-2\">\n    <h4>Sensors</h4>\n    <small>To place a sensor: <br>1. Click on the map to place a marker <br> 2. Click on the marker to remove it <br> 3.\n      Click on senor name to show its position</small>\n    <div class=\"m-3\">\n      <p>Free senosrs</p>\n      <div class=\"row\">\n        <div *ngFor=\"let sn of sensors\">\n          <div class=\"col-1\" *ngIf=\"sn.chosen == false\">\n            <button type=\"button\" (click)=\"addSensorToDeploy(sn.sensor._id)\" class=\"btn btn-outline-dark\"\n                    disabled>{{sn.sensor.name}}</button>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"m-3\">\n      <p>Placed senosrs</p>\n      <div class=\"row\">\n        <div *ngFor=\"let sn of sensors\">\n          <div class=\"col-1\" *ngIf=\"sn.chosen == true\">\n            <button type=\"button\" (click)=\"showLocation(sn.sensor._id)\"\n                    class=\"btn btn-outline-success\">{{sn.sensor.name}}</button>\n          </div>\n        </div>\n      </div>\n    </div>\n\n\n    <agm-map\n      [latitude]=\"46.04840798323542\"\n      [longitude]=\"14.506113341719598\"\n      [zoom]=\"13\"\n      (mapClick)=\"addMarker($event.coords.lat, $event.coords.lng)\"\n      [mapTypeId]='mapType'\n    >\n      <agm-marker\n        *ngFor=\"let sn of sensors\"\n        [latitude]=\"sn.latitude\"\n        [longitude]=\"sn.longitude\"\n        [opacity]=\"sn.alpha\"\n        [markerDraggable]=\"false\"\n        (markerClick)=\"removeSensor($event)\"\n      >\n      </agm-marker>\n    </agm-map>\n    <p *ngIf=\"selectedMarker\">\n      Lat: {{ selectedMarker.lat }} Lng: {{ selectedMarker.lng }}\n    </p>\n  </div>\n</div>\n\n\n  <div class=\"deployment-div m-3\">\n    <div class=\"m-2\">\n      <h4>Gateways</h4>\n      <small>Select the gateways by clicking on them. <br>Unselect the gateways in similar fashion. <br>Gateway location\n        is\n        not saved. Please remember it or write it down in deployment description. </small>\n      <div *ngIf=\"gateways.length > 0\">\n        <p>Free gateways</p>\n        <div class=\"row\">\n          <div *ngFor=\"let gw of gateways\">\n            <div class=\"col-1\" *ngIf=\"gw.chosen == false\">\n              <button type=\"button\" (click)=\"addGatewayToDeploy(gw.gateway._id)\"\n                      class=\"btn btn-outline-primary\">{{gw.gateway.name}}</button>\n            </div>\n          </div>\n        </div>\n\n\n        <p>Selected gateways</p>\n        <div class=\"row\">\n          <div *ngFor=\"let gw of gateways\">\n            <div class=\"col-1\" *ngIf=\"gw.chosen == true\">\n              <button type=\"button\" (click)=\"addGatewayToDeploy(gw.gateway._id)\"\n                      class=\"btn btn-outline-success\">{{gw.gateway.name}}</button>\n            </div>\n          </div>\n        </div>\n      </div>\n\n      <div *ngIf=\"gateways.length == 0\">\n        <p>No free gateways currently availale.</p>\n      </div>\n    </div>\n  </div>\n  <div class=\"deployment-div m-3\">\n    <div class=\"m-2\">\n      <h4>NOTE: Once the deployment is deployed, it cannot be changed!!!</h4>\n      <button type=\"button\" (click)=\"openModal(not_ok, ok)\" class=\"btn btn-outline-danger\">DEPLOY</button>\n    </div>\n  </div>\n\n  <ng-template #not_ok>\n    <div class=\"modal-body text-center bg-custom\">\n      <div *ngFor=\"let err of errorMessages\">\n        <p>{{err}}</p>\n      </div>\n      <button type=\"button\" class=\"btn btn-outline-dark m-1\" (click)=\"decline()\">Close</button>\n    </div>\n  </ng-template>\n\n  <ng-template #ok>\n    <div class=\"modal-body text-center bg-custom\">\n      <p>You are about to deploy this deployment.</p>\n      <button type=\"button\" class=\"btn btn-outline-primary m-1 \" (click)=\"deployDeployment(done, error)\">Deploy</button>\n      <button type=\"button\" class=\"btn btn-outline-dark m-1\" (click)=\"decline()\">Not yet</button>\n    </div>\n  </ng-template>\n\n<ng-template #done>\n  <div class=\"modal-body text-center bg-custom\">\n    <p>Deployment was successfully deployed!</p>\n    <button type=\"button\" class=\"btn btn-outline-dark m-1\" (click)=\"decline()\">Close</button>\n  </div>\n</ng-template>\n\n<ng-template #error>\n  <div class=\"modal-body text-center bg-custom\">\n    <p>Error</p>\n\n    <button type=\"button\" class=\"btn btn-outline-dark m-1\" (click)=\"decline()\">Close</button>\n  </div>\n</ng-template>\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/gateways/gateways.component.html":
/*!***************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/components/gateways/gateways.component.html ***!
  \***************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"row m-4\">\n  <div class=\"col\">\n    <div *ngIf=\"gateways && gateways.length == 0\">\n      <p>There are no gateways!</p>\n    </div>\n    <div *ngFor=\"let gateway of gateways\">\n      <div class=\"gateway-div mb-4\">\n        <div class=\"row m-3\">\n          <div class=\"col-3\">\n            <small>Name: </small>\n            <p class=\"gateway-spec\">{{gateway.name}}</p>\n            <small>MAC:  </small>\n            <p class=\"gateway-spec\"><span *ngFor=\"let num of gateway.mac; index as i\">{{num.toString(16)}}<span *ngIf=\"i<5\">:</span></span> </p>\n          </div>\n          <div class=\"col-5\">\n            <div *ngIf=\"gateway.current_deployment\">\n            <small>Deployment: </small>\n            <p class=\"gateway-spec\">{{gateway.current_deployment}}</p>\n            <small>Location: </small>\n            <p class=\"gateway-spec\">{{gateway.current_location[0].toFixed(3)}}, {{gateway.current_location[1].toFixed(3)}}</p>\n            </div>\n          </div>\n          <div class=\"col-4\">\n\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/home/home.component.html":
/*!*******************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/components/home/home.component.html ***!
  \*******************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<!---\n<div class=\"row mt-5\">\n  <div class=\"col-2\"></div>\n  <div class=\"col-8\">\n    <ul class=\"nav nav-pills nav-fill\">\n      <li class=\"nav-item\">\n        <button type=\"button\" class=\"btn btn-outline-primary\">\n        <a routerLink=\"/deployments\">Deployments</a>\n          </button>\n      </li>\n      <li class=\"nav-item\">\n\n        <button type=\"button\" class=\"btn btn-outline-primary\">\n        <a routerLink=\"/sensors\">Sensors</a>\n        </button>\n      </li>\n      <li class=\"nav-item\">\n\n        <button type=\"button\" class=\"btn btn-outline-primary\">\n        <a routerLink=\"/gateways\">Gateways</a>\n        </button>\n      </li>\n    </ul>\n\n\n  </div>\n</div>\n--->\n<nav class=\"navbar navbar-expand-lg navbar-light bg-light\">\n  <a class=\"navbar-brand\" href=\"#\">Urban Noise Sensing Platform</a>\n  <button class=\"navbar-toggler\" type=\"button\" data-toggle=\"collapse\" data-target=\"#navbarSupportedContent\" aria-controls=\"navbarSupportedContent\" aria-expanded=\"false\" aria-label=\"Toggle navigation\">\n    <span class=\"navbar-toggler-icon\"></span>\n  </button>\n\n  <div class=\"collapse navbar-collapse\" id=\"navbarSupportedContent\">\n    <ul class=\"navbar-nav mr-auto\">\n      <li class=\"nav-item\">\n        <a class=\"nav-link\" routerLink=\"/deployments\">Deployments</a>\n      </li>\n      <li class=\"nav-item\">\n        <a class=\"nav-link\" routerLink=\"/sensors\">Sensors</a>\n      </li>\n      <li class=\"nav-item\">\n        <a class=\"nav-link\" routerLink=\"/gateways\">Gateways</a>\n      </li>\n\n      <!---\n      <li class=\"nav-item dropdown\">\n        <a class=\"nav-link dropdown-toggle\" href=\"#\" id=\"navbarDropdown\" role=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\">\n          Dropdown\n        </a>\n        <div class=\"dropdown-menu\" aria-labelledby=\"navbarDropdown\">\n          <a class=\"dropdown-item\" href=\"#\">Action</a>\n          <a class=\"dropdown-item\" href=\"#\">Another action</a>\n          <div class=\"dropdown-divider\"></div>\n          <a class=\"dropdown-item\" href=\"#\">Something else here</a>\n        </div>\n      </li>\n      <li class=\"nav-item\">\n        <a class=\"nav-link disabled\" href=\"#\" tabindex=\"-1\" aria-disabled=\"true\">Disabled</a>\n      </li>\n      --->\n    </ul>\n    <!---\n    <form class=\"form-inline my-2 my-lg-0\">\n      <input class=\"form-control mr-sm-2\" type=\"search\" placeholder=\"Search\" aria-label=\"Search\">\n      <button class=\"btn btn-outline-success my-2 my-sm-0\" type=\"submit\">Search</button>\n    </form>\n    --->\n  </div>\n</nav>\n\n<div class=\"row\">\n  <div class=\"col-1\"></div>\n  <div class=\"col-10\">\n    <router-outlet></router-outlet>\n  </div>\n</div>\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/review-deployment/review-deployment.component.html":
/*!*********************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/components/review-deployment/review-deployment.component.html ***!
  \*********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div *ngIf=\"deployment\">\n  <h2>{{deployment.name}}</h2>\n  <p>{{deployment.description}}</p>\n</div>\n\n<div class=\"deployment-div m-3\">\n  <div class=\"m-2\">\n\n\n    <div class=\"m-3\">\n      <h4>Sensors</h4>\n      <p>Placed senosrs</p>\n      <div class=\"row\" *ngIf=\"sensors\">\n        <div *ngFor=\"let sn of sensors\">\n          <div class=\"col-1\">\n            <button type=\"button\" (click)=\"showLocation(sn.sensor._id)\"\n                    class=\"btn btn-outline-success\">{{sn.sensor.name}}</button>\n          </div>\n        </div>\n      </div>\n\n      <div *ngIf=\"sensors\" class=\"my-3\">\n      <agm-map\n        [latitude]=\"longitude\"\n        [longitude]=\"latitude\"\n        [zoom]=\"13\"\n        [mapTypeId]='mapType'\n      >\n        <agm-marker\n          *ngFor=\"let sn of sensors\"\n          [latitude]=\"sn.sensor.current_location[0]\"\n          [longitude]=\"sn.sensor.current_location[1]\"\n          [opacity]=\"sn.alpha\"\n          [markerDraggable]=\"false\"\n        >\n        </agm-marker>\n      </agm-map>\n    </div>\n  </div>\n  </div>\n</div>\n\n\n<div class=\"deployment-div m-3\" *ngIf=\"gateways\">\n  <div class=\"m-4\">\n    <h4>Gateways</h4>\n    <div *ngIf=\"gateways.length > 0\" >\n\n      <p>Selected gateways</p>\n      <div class=\"row\">\n        <div *ngFor=\"let gw of gateways\" class=\"m-2\">\n          <button type=\"button\"\n                  class=\"btn btn-outline-success\">{{gw.name}}</button>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div class=\"deployment-div m-3\">\n  <div class=\"m-2\">\n    <h4>NOTE: Once the deployment is deployed, it cannot be changed!!!</h4>\n    <!---<button type=\"button\" (click)=\"openModal(not_ok, ok)\" class=\"btn btn-outline-danger\">DEPLOY</button>--->\n  </div>\n</div>\n\n<!---\n<ng-template #not_ok>\n  <div class=\"modal-body text-center bg-custom\">\n    <div *ngFor=\"let err of errorMessages\">\n      <p>{{err}}</p>\n    </div>\n    <button type=\"button\" class=\"btn btn-outline-dark m-1\" (click)=\"decline()\">Close</button>\n  </div>\n</ng-template>\n\n<ng-template #ok>\n  <div class=\"modal-body text-center bg-custom\">\n    <p>You are about to deploy this deployment.</p>\n    <button type=\"button\" class=\"btn btn-outline-primary m-1 \" (click)=\"deployDeployment()\">Deploy</button>\n    <button type=\"button\" class=\"btn btn-outline-dark m-1\" (click)=\"decline()\">Not yet</button>\n  </div>\n</ng-template>\n--->\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/sensors/sensors.component.html":
/*!*************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/components/sensors/sensors.component.html ***!
  \*************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"row m-4\">\n\n  <div *ngFor=\"let sensori of sensors\" class=\"col-xl-6 col-lg-12 m-0\">\n\n      <div class=\"sensor-div mb-4\">\n        <div class=\"row m-3\">\n          <div class=\"col-4\">\n            <small>Name: </small>\n            <p class=\"sensor-spec\">{{sensori.name}}</p>\n            <div *ngIf=\"sensori.battery_voltage\">\n            <small>Battery voltage: </small>\n            <p class=\"sensor-spec\">{{sensori.battery_voltage}} V</p>\n            </div>\n          </div>\n          <div class=\"col-8\">\n            <div *ngIf=\"sensori.current_deployment\">\n            <small>Deployment: </small>\n            <p class=\"sensor-spec\">{{sensori.current_deployment}}</p>\n            <small>Location: </small>\n            <p class=\"sensor-spec\">{{sensori.current_location[0].toFixed(3)}}, {{sensori.current_location[1].toFixed(3)}}</p>\n            </div>\n          </div>\n\n      </div>\n    </div>\n  </div>\n</div>\n");

/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__extends", function() { return __extends; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__assign", function() { return __assign; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__rest", function() { return __rest; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__decorate", function() { return __decorate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__param", function() { return __param; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__metadata", function() { return __metadata; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__awaiter", function() { return __awaiter; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__generator", function() { return __generator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__createBinding", function() { return __createBinding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__exportStar", function() { return __exportStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__values", function() { return __values; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__read", function() { return __read; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spread", function() { return __spread; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__spreadArrays", function() { return __spreadArrays; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__await", function() { return __await; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncGenerator", function() { return __asyncGenerator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncDelegator", function() { return __asyncDelegator; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__asyncValues", function() { return __asyncValues; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__makeTemplateObject", function() { return __makeTemplateObject; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importStar", function() { return __importStar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__importDefault", function() { return __importDefault; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldGet", function() { return __classPrivateFieldGet; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "__classPrivateFieldSet", function() { return __classPrivateFieldSet; });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    }
    return __assign.apply(this, arguments);
}

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
}

function __metadata(metadataKey, metadataValue) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function __createBinding(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}

function __exportStar(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) exports[p] = m[p];
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};

function __await(v) {
    return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};

function __importStar(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result.default = mod;
    return result;
}

function __importDefault(mod) {
    return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
}

function __classPrivateFieldSet(receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
}


/***/ }),

/***/ "./src/app/app-routing.module.ts":
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _app_components_home_home_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../app/components/home/home.component */ "./src/app/components/home/home.component.ts");
/* harmony import */ var _app_components_deployments_deployments_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../app/components/deployments/deployments.component */ "./src/app/components/deployments/deployments.component.ts");
/* harmony import */ var _app_components_sensors_sensors_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../app/components/sensors/sensors.component */ "./src/app/components/sensors/sensors.component.ts");
/* harmony import */ var _app_components_gateways_gateways_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../app/components/gateways/gateways.component */ "./src/app/components/gateways/gateways.component.ts");
/* harmony import */ var _components_create_deployment_create_deployment_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/create-deployment/create-deployment.component */ "./src/app/components/create-deployment/create-deployment.component.ts");
/* harmony import */ var _components_edit_deployment_edit_deployment_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/edit-deployment/edit-deployment.component */ "./src/app/components/edit-deployment/edit-deployment.component.ts");
/* harmony import */ var _components_review_deployment_review_deployment_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/review-deployment/review-deployment.component */ "./src/app/components/review-deployment/review-deployment.component.ts");










const routes = [
    {
        path: '',
        component: _app_components_home_home_component__WEBPACK_IMPORTED_MODULE_3__["HomeComponent"],
        children: [
            {
                path: 'deployments',
                component: _app_components_deployments_deployments_component__WEBPACK_IMPORTED_MODULE_4__["DeploymentsComponent"]
            },
            {
                path: 'sensors',
                component: _app_components_sensors_sensors_component__WEBPACK_IMPORTED_MODULE_5__["SensorsComponent"]
            },
            {
                path: 'gateways',
                component: _app_components_gateways_gateways_component__WEBPACK_IMPORTED_MODULE_6__["GatewaysComponent"]
            },
            {
                path: 'createdeployment',
                component: _components_create_deployment_create_deployment_component__WEBPACK_IMPORTED_MODULE_7__["CreateDeploymentComponent"]
            },
            {
                path: 'editdeployment/:id',
                component: _components_edit_deployment_edit_deployment_component__WEBPACK_IMPORTED_MODULE_8__["EditDeploymentComponent"]
            },
            {
                path: 'reviewdeployment/:id',
                component: _components_review_deployment_review_deployment_component__WEBPACK_IMPORTED_MODULE_9__["ReviewDeploymentComponent"]
            }
        ]
    },
    { path: '**', redirectTo: '' }
];
let AppRoutingModule = class AppRoutingModule {
};
AppRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forRoot(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
    })
], AppRoutingModule);



/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2FwcC5jb21wb25lbnQuY3NzIn0= */");

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");


let AppComponent = class AppComponent {
    constructor() {
        this.title = 'UNSfrontend';
    }
};
AppComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-root',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./app.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/app.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")).default]
    })
], AppComponent);



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm2015/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./app-routing.module */ "./src/app/app-routing.module.ts");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _components_sensors_sensors_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/sensors/sensors.component */ "./src/app/components/sensors/sensors.component.ts");
/* harmony import */ var _components_gateways_gateways_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/gateways/gateways.component */ "./src/app/components/gateways/gateways.component.ts");
/* harmony import */ var _components_deployments_deployments_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/deployments/deployments.component */ "./src/app/components/deployments/deployments.component.ts");
/* harmony import */ var _components_home_home_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/home/home.component */ "./src/app/components/home/home.component.ts");
/* harmony import */ var _components_create_deployment_create_deployment_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/create-deployment/create-deployment.component */ "./src/app/components/create-deployment/create-deployment.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm2015/forms.js");
/* harmony import */ var _components_edit_deployment_edit_deployment_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/edit-deployment/edit-deployment.component */ "./src/app/components/edit-deployment/edit-deployment.component.ts");
/* harmony import */ var _agm_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @agm/core */ "./node_modules/@agm/core/fesm2015/agm-core.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var _components_sensor_map_sensor_map_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/sensor-map/sensor-map.component */ "./src/app/components/sensor-map/sensor-map.component.ts");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ngx-bootstrap/modal */ "./node_modules/ngx-bootstrap/modal/fesm2015/ngx-bootstrap-modal.js");
/* harmony import */ var _components_review_deployment_review_deployment_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/review-deployment/review-deployment.component */ "./src/app/components/review-deployment/review-deployment.component.ts");


















let AppModule = class AppModule {
};
AppModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_2__["NgModule"])({
        declarations: [
            _app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"],
            _components_sensors_sensors_component__WEBPACK_IMPORTED_MODULE_6__["SensorsComponent"],
            _components_gateways_gateways_component__WEBPACK_IMPORTED_MODULE_7__["GatewaysComponent"],
            _components_deployments_deployments_component__WEBPACK_IMPORTED_MODULE_8__["DeploymentsComponent"],
            _components_home_home_component__WEBPACK_IMPORTED_MODULE_9__["HomeComponent"],
            _components_create_deployment_create_deployment_component__WEBPACK_IMPORTED_MODULE_10__["CreateDeploymentComponent"],
            _components_edit_deployment_edit_deployment_component__WEBPACK_IMPORTED_MODULE_12__["EditDeploymentComponent"],
            _components_sensor_map_sensor_map_component__WEBPACK_IMPORTED_MODULE_15__["SensorMapComponent"],
            _components_review_deployment_review_deployment_component__WEBPACK_IMPORTED_MODULE_17__["ReviewDeploymentComponent"]
        ],
        imports: [
            _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__["BrowserModule"],
            _app_routing_module__WEBPACK_IMPORTED_MODULE_4__["AppRoutingModule"],
            _angular_common_http__WEBPACK_IMPORTED_MODULE_3__["HttpClientModule"],
            ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_16__["ModalModule"].forRoot(),
            _angular_forms__WEBPACK_IMPORTED_MODULE_11__["FormsModule"],
            _agm_core__WEBPACK_IMPORTED_MODULE_13__["AgmCoreModule"].forRoot({ apiKey: _environments_environment__WEBPACK_IMPORTED_MODULE_14__["environment"].mapsKey })
        ],
        providers: [],
        bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_5__["AppComponent"]]
    })
], AppModule);



/***/ }),

/***/ "./src/app/components/create-deployment/create-deployment.component.css":
/*!******************************************************************************!*\
  !*** ./src/app/components/create-deployment/create-deployment.component.css ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvY3JlYXRlLWRlcGxveW1lbnQvY3JlYXRlLWRlcGxveW1lbnQuY29tcG9uZW50LmNzcyJ9 */");

/***/ }),

/***/ "./src/app/components/create-deployment/create-deployment.component.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/components/create-deployment/create-deployment.component.ts ***!
  \*****************************************************************************/
/*! exports provided: CreateDeploymentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreateDeploymentComponent", function() { return CreateDeploymentComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");


let CreateDeploymentComponent = class CreateDeploymentComponent {
    constructor() { }
    ngOnInit() {
    }
};
CreateDeploymentComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-create-deployment',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./create-deployment.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/create-deployment/create-deployment.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./create-deployment.component.css */ "./src/app/components/create-deployment/create-deployment.component.css")).default]
    })
], CreateDeploymentComponent);



/***/ }),

/***/ "./src/app/components/deployments/deployments.component.css":
/*!******************************************************************!*\
  !*** ./src/app/components/deployments/deployments.component.css ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".deployment-div{\r\n  border: #bbbbff;\r\n  border-radius: 0.4em;\r\n  border-style: solid;\r\n  border-width: 0.001em;\r\n}\r\n\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9kZXBsb3ltZW50cy9kZXBsb3ltZW50cy5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsZUFBZTtFQUNmLG9CQUFvQjtFQUNwQixtQkFBbUI7RUFDbkIscUJBQXFCO0FBQ3ZCIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9kZXBsb3ltZW50cy9kZXBsb3ltZW50cy5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmRlcGxveW1lbnQtZGl2e1xyXG4gIGJvcmRlcjogI2JiYmJmZjtcclxuICBib3JkZXItcmFkaXVzOiAwLjRlbTtcclxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xyXG4gIGJvcmRlci13aWR0aDogMC4wMDFlbTtcclxufVxyXG4iXX0= */");

/***/ }),

/***/ "./src/app/components/deployments/deployments.component.ts":
/*!*****************************************************************!*\
  !*** ./src/app/components/deployments/deployments.component.ts ***!
  \*****************************************************************/
/*! exports provided: DeploymentsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeploymentsComponent", function() { return DeploymentsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _services_deployment_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/deployment.service */ "./src/app/services/deployment.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");




let DeploymentsComponent = class DeploymentsComponent {
    constructor(deploymentService, router) {
        this.deploymentService = deploymentService;
        this.router = router;
        this.creating = false;
        this.newdep = { name: '' };
    }
    ngOnInit() {
        this.getDeployments();
    }
    getDeployments() {
        this.deploymentService.getDeployments().then(result => {
            this.deployments = result;
            console.log(result);
        });
    }
    switchCreating() {
        this.creating = !this.creating;
    }
    createDeployment() {
        console.log("creating");
        console.log(this.newdep.name);
        this.deploymentService.createDeployment(this.newdep).then(result => {
            console.log(result);
            this.newdep.name = '';
            this.creating = false;
            this.deployments.unshift(result);
            this.navigateToEdit(result._id);
        });
    }
    navigateToEdit(id) {
        this.router.navigateByUrl(`editdeployment/${id}`);
    }
    navigateToReview(id) {
        this.router.navigateByUrl(`reviewdeployment/${id}`);
    }
};
DeploymentsComponent.ctorParameters = () => [
    { type: _services_deployment_service__WEBPACK_IMPORTED_MODULE_2__["DeploymentService"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] }
];
DeploymentsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-deployments',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./deployments.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/deployments/deployments.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./deployments.component.css */ "./src/app/components/deployments/deployments.component.css")).default]
    })
], DeploymentsComponent);



/***/ }),

/***/ "./src/app/components/edit-deployment/edit-deployment.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/components/edit-deployment/edit-deployment.component.css ***!
  \**************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("agm-map { height: 600px; /* height is required */ }\r\n.deployment-div{\r\n  border: #bbbbff;\r\n  border-radius: 0.4em;\r\n  border-style: solid;\r\n  border-width: 0.001em;\r\n\r\n}\r\n\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9lZGl0LWRlcGxveW1lbnQvZWRpdC1kZXBsb3ltZW50LmNvbXBvbmVudC5jc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsVUFBVSxhQUFhLEVBQUUsdUJBQXVCLEVBQUU7QUFDbEQ7RUFDRSxlQUFlO0VBQ2Ysb0JBQW9CO0VBQ3BCLG1CQUFtQjtFQUNuQixxQkFBcUI7O0FBRXZCIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9lZGl0LWRlcGxveW1lbnQvZWRpdC1kZXBsb3ltZW50LmNvbXBvbmVudC5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJhZ20tbWFwIHsgaGVpZ2h0OiA2MDBweDsgLyogaGVpZ2h0IGlzIHJlcXVpcmVkICovIH1cclxuLmRlcGxveW1lbnQtZGl2e1xyXG4gIGJvcmRlcjogI2JiYmJmZjtcclxuICBib3JkZXItcmFkaXVzOiAwLjRlbTtcclxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xyXG4gIGJvcmRlci13aWR0aDogMC4wMDFlbTtcclxuXHJcbn1cclxuIl19 */");

/***/ }),

/***/ "./src/app/components/edit-deployment/edit-deployment.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/components/edit-deployment/edit-deployment.component.ts ***!
  \*************************************************************************/
/*! exports provided: EditDeploymentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditDeploymentComponent", function() { return EditDeploymentComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _services_deployment_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/deployment.service */ "./src/app/services/deployment.service.ts");
/* harmony import */ var _services_sensor_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/sensor.service */ "./src/app/services/sensor.service.ts");
/* harmony import */ var _services_gateway_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/gateway.service */ "./src/app/services/gateway.service.ts");
/* harmony import */ var _models_data_deployment__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../models/data-deployment */ "./src/app/models/data-deployment.ts");
/* harmony import */ var ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-bootstrap/modal */ "./node_modules/ngx-bootstrap/modal/fesm2015/ngx-bootstrap-modal.js");








let EditDeploymentComponent = class EditDeploymentComponent {
    constructor(modalService, activatedRoute, deploymentService, sensorService, gatewayService, router) {
        this.modalService = modalService;
        this.activatedRoute = activatedRoute;
        this.deploymentService = deploymentService;
        this.sensorService = sensorService;
        this.gatewayService = gatewayService;
        this.router = router;
        this.mapType = 'hybrid';
        this.markers = [];
    }
    ngOnInit() {
        this.id = this.activatedRoute.snapshot.paramMap.get("id");
        console.log(this.id);
        this.getDeployment();
        this.getSensors();
        this.getGateways();
    }
    getSensors() {
        this.sensorService.getSensors().then(result => {
            console.log(result);
            this.sensors = [];
            for (let sn of result) {
                if (!sn.current_deployment || sn.current_deployment == '') {
                    this.sensors.push({ sensor: sn, chosen: false, latitude: 0, longitude: 0, alpha: 0 });
                }
            }
            console.log(this.sensors);
        });
    }
    openModal(not_ok, ok) {
        this.errorMessages = [];
        let gw_num = 0;
        for (let gw of this.gateways) {
            if (gw.chosen == true) {
                gw_num++;
            }
        }
        if (gw_num < 1) {
            this.errorMessages.push("You don't have any gateways selected!");
        }
        let sn_num = 0;
        for (let sn of this.sensors) {
            if (sn.chosen == true) {
                sn_num++;
            }
        }
        if (sn_num < 1) {
            this.errorMessages.push("Place at least one sensor!");
        }
        if (!this.deployment.name || this.deployment.name == '') {
            this.errorMessages.push("Save the name of this deployment!");
        }
        if (this.deployment.status != 'pending') {
            this.errorMessages.push("Something went wrong with your deployment. Is it already deployed?");
        }
        if (this.errorMessages.length != 0) {
            this.modalRef = this.modalService.show(not_ok, { class: 'modal-sm' });
        }
        else {
            this.modalRef = this.modalService.show(ok, { class: 'modal-sm' });
        }
    }
    decline() {
        this.modalRef.hide();
    }
    getGateways() {
        this.gateways = [];
        this.gatewayService.getGateways().then(result => {
            console.log(result);
            this.gateways = [];
            for (let gw of result) {
                if (!gw.current_deployment || gw.current_deployment == '') {
                    this.gateways.push({ gateway: gw, chosen: false });
                }
            }
            console.log(this.sensors);
        });
    }
    deployDeployment(done, error) {
        for (let sn of this.sensors) {
            if (sn.chosen == true) {
                let data_dep = new _models_data_deployment__WEBPACK_IMPORTED_MODULE_6__["DataDeployment"]();
                data_dep.location = [sn.latitude, sn.longitude];
                data_dep.sensor_id = sn.sensor._id;
                this.deployment.sensors.push(data_dep);
            }
        }
        for (let gw of this.gateways) {
            if (gw.chosen == true) {
                let data_dep = new _models_data_deployment__WEBPACK_IMPORTED_MODULE_6__["DataDeployment"]();
                data_dep.sensor_id = gw.gateway._id;
                data_dep.location = [0, 0];
                this.deployment.gateways.push(data_dep);
            }
        }
        this.deploymentService.updateDeployment(this.deployment._id, this.deployment).then(res => {
            console.log(res);
            this.getDeployment();
        });
    }
    addGatewayToDeploy(id) {
        for (let gw of this.gateways) {
            if (gw.gateway._id == id) {
                gw.chosen = !gw.chosen;
            }
        }
    }
    getDeployment() {
        this.deploymentService.getOneDeployment(this.id).then(result => {
            this.deployment = result;
            this.depDTO = result;
            console.log(this.deployment);
            if (this.deployment.status == 'deployed') {
                this.router.navigateByUrl(`reviewdeployment/${this.deployment._id}`);
            }
        });
    }
    discardChanges() {
        this.getDeployment();
    }
    saveChangesForm() {
        this.deploymentService.updateDeployment(this.deployment._id, this.depDTO).then(res => {
            console.log(res);
            this.getDeployment();
        });
    }
    addSensorToDeploy(id) {
    }
    showLocation(id) {
        console.log(this.sensors);
        for (let sn of this.sensors) {
            if (sn.chosen) {
                sn.alpha = 0.4;
            }
            if (sn.sensor._id == id) {
                sn.alpha = 1;
            }
        }
    }
    addMarker(lat, lng) {
        for (let sn of this.sensors) {
            if (sn.chosen == false) {
                sn.chosen = true;
                sn.longitude = lng;
                sn.latitude = lat;
                sn.alpha = 0.4;
                return;
            }
        }
        //this.markers.push({ lat, lng, alpha: 0.4 });
    }
    max(coordType) {
        return Math.max(...this.markers.map(marker => marker[coordType]));
    }
    min(coordType) {
        return Math.min(...this.markers.map(marker => marker[coordType]));
    }
    removeSensor(event) {
        console.log(event);
        for (let sn of this.sensors) {
            if (sn.longitude == event.longitude && sn.latitude == event.latitude) {
                sn.chosen = false;
                sn.alpha = 0;
                return;
            }
        }
    }
    selectMarker(event) {
        console.log(event);
        for (let sn of this.sensors) {
            if (sn.longitude == event.longitude && sn.latitude == event.latitude && sn.chosen == true) {
                sn.chosen = false;
                sn.alpha = 0;
                return;
            }
        }
    }
};
EditDeploymentComponent.ctorParameters = () => [
    { type: ngx_bootstrap_modal__WEBPACK_IMPORTED_MODULE_7__["BsModalService"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"] },
    { type: _services_deployment_service__WEBPACK_IMPORTED_MODULE_3__["DeploymentService"] },
    { type: _services_sensor_service__WEBPACK_IMPORTED_MODULE_4__["SensorService"] },
    { type: _services_gateway_service__WEBPACK_IMPORTED_MODULE_5__["GatewayService"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] }
];
EditDeploymentComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-edit-deployment',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./edit-deployment.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/edit-deployment/edit-deployment.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./edit-deployment.component.css */ "./src/app/components/edit-deployment/edit-deployment.component.css")).default]
    })
], EditDeploymentComponent);



/***/ }),

/***/ "./src/app/components/gateways/gateways.component.css":
/*!************************************************************!*\
  !*** ./src/app/components/gateways/gateways.component.css ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".gateway-div{\r\n  border: #bbbbff;\r\n  border-radius: 0.4em;\r\n  border-style: solid;\r\n  border-width: 0.001em;\r\n}\r\n\r\n\r\n.gateway-spec{\r\n  border-radius: 5px;\r\n  background: #ddeeff;\r\n  padding: 0.251em;\r\n}\r\n\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9nYXRld2F5cy9nYXRld2F5cy5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsZUFBZTtFQUNmLG9CQUFvQjtFQUNwQixtQkFBbUI7RUFDbkIscUJBQXFCO0FBQ3ZCOzs7QUFHQTtFQUNFLGtCQUFrQjtFQUNsQixtQkFBbUI7RUFDbkIsZ0JBQWdCO0FBQ2xCIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9nYXRld2F5cy9nYXRld2F5cy5jb21wb25lbnQuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmdhdGV3YXktZGl2e1xyXG4gIGJvcmRlcjogI2JiYmJmZjtcclxuICBib3JkZXItcmFkaXVzOiAwLjRlbTtcclxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xyXG4gIGJvcmRlci13aWR0aDogMC4wMDFlbTtcclxufVxyXG5cclxuXHJcbi5nYXRld2F5LXNwZWN7XHJcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gIGJhY2tncm91bmQ6ICNkZGVlZmY7XHJcbiAgcGFkZGluZzogMC4yNTFlbTtcclxufVxyXG4iXX0= */");

/***/ }),

/***/ "./src/app/components/gateways/gateways.component.ts":
/*!***********************************************************!*\
  !*** ./src/app/components/gateways/gateways.component.ts ***!
  \***********************************************************/
/*! exports provided: GatewaysComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GatewaysComponent", function() { return GatewaysComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _services_gateway_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/gateway.service */ "./src/app/services/gateway.service.ts");



let GatewaysComponent = class GatewaysComponent {
    constructor(gatewayService) {
        this.gatewayService = gatewayService;
    }
    ngOnInit() {
        console.log("hej");
        this.getGateways();
    }
    getGateways() {
        this.gatewayService.getGateways().then(result => {
            this.gateways = result;
        });
    }
};
GatewaysComponent.ctorParameters = () => [
    { type: _services_gateway_service__WEBPACK_IMPORTED_MODULE_2__["GatewayService"] }
];
GatewaysComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-gateways',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./gateways.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/gateways/gateways.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./gateways.component.css */ "./src/app/components/gateways/gateways.component.css")).default]
    })
], GatewaysComponent);



/***/ }),

/***/ "./src/app/components/home/home.component.css":
/*!****************************************************!*\
  !*** ./src/app/components/home/home.component.css ***!
  \****************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvaG9tZS9ob21lLmNvbXBvbmVudC5jc3MifQ== */");

/***/ }),

/***/ "./src/app/components/home/home.component.ts":
/*!***************************************************!*\
  !*** ./src/app/components/home/home.component.ts ***!
  \***************************************************/
/*! exports provided: HomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeComponent", function() { return HomeComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");


let HomeComponent = class HomeComponent {
    constructor() { }
    ngOnInit() {
    }
};
HomeComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-home',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./home.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/home/home.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./home.component.css */ "./src/app/components/home/home.component.css")).default]
    })
], HomeComponent);



/***/ }),

/***/ "./src/app/components/review-deployment/review-deployment.component.css":
/*!******************************************************************************!*\
  !*** ./src/app/components/review-deployment/review-deployment.component.css ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("agm-map { height: 600px; /* height is required */ }\r\n.deployment-div{\r\n  border: #bbbbff;\r\n  border-radius: 0.4em;\r\n  border-style: solid;\r\n  border-width: 0.001em;\r\n\r\n}\r\n\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9yZXZpZXctZGVwbG95bWVudC9yZXZpZXctZGVwbG95bWVudC5jb21wb25lbnQuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFVBQVUsYUFBYSxFQUFFLHVCQUF1QixFQUFFO0FBQ2xEO0VBQ0UsZUFBZTtFQUNmLG9CQUFvQjtFQUNwQixtQkFBbUI7RUFDbkIscUJBQXFCOztBQUV2QiIsImZpbGUiOiJzcmMvYXBwL2NvbXBvbmVudHMvcmV2aWV3LWRlcGxveW1lbnQvcmV2aWV3LWRlcGxveW1lbnQuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbImFnbS1tYXAgeyBoZWlnaHQ6IDYwMHB4OyAvKiBoZWlnaHQgaXMgcmVxdWlyZWQgKi8gfVxyXG4uZGVwbG95bWVudC1kaXZ7XHJcbiAgYm9yZGVyOiAjYmJiYmZmO1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuNGVtO1xyXG4gIGJvcmRlci1zdHlsZTogc29saWQ7XHJcbiAgYm9yZGVyLXdpZHRoOiAwLjAwMWVtO1xyXG5cclxufVxyXG4iXX0= */");

/***/ }),

/***/ "./src/app/components/review-deployment/review-deployment.component.ts":
/*!*****************************************************************************!*\
  !*** ./src/app/components/review-deployment/review-deployment.component.ts ***!
  \*****************************************************************************/
/*! exports provided: ReviewDeploymentComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReviewDeploymentComponent", function() { return ReviewDeploymentComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm2015/router.js");
/* harmony import */ var _services_sensor_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/sensor.service */ "./src/app/services/sensor.service.ts");
/* harmony import */ var _services_deployment_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../services/deployment.service */ "./src/app/services/deployment.service.ts");
/* harmony import */ var _services_gateway_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../services/gateway.service */ "./src/app/services/gateway.service.ts");






let ReviewDeploymentComponent = class ReviewDeploymentComponent {
    constructor(deploymentService, sensorService, gatewayService, activatedRoute) {
        this.deploymentService = deploymentService;
        this.sensorService = sensorService;
        this.gatewayService = gatewayService;
        this.activatedRoute = activatedRoute;
        this.mapType = "hybrid";
        this.longitude = 0;
        this.latitude = 0;
    }
    ngOnInit() {
        this.id = this.activatedRoute.snapshot.paramMap.get("id");
        this.getDeployment();
    }
    getDeployment() {
        this.deploymentService.getOneDeployment(this.id).then((res) => {
            this.deployment = res;
            console.log(res);
            this.getSensors();
            this.getGateways();
        });
    }
    getSensors() {
        this.sensors = [];
        for (let sen of this.deployment.sensors) {
            this.sensorService.getOneSensor(sen.sensor_id).then((res) => {
                this.sensors.push({ sensor: res, alpha: 0.4 });
                this.longitude += res.current_location[0] / this.deployment.sensors.length;
                // @ts-ignore
                this.latitude += res.current_location[1] / this.deployment.sensors.length;
                console.log(res);
            });
        }
    }
    getGateways() {
        this.gateways = [];
        for (let gw of this.deployment.gateways) {
            this.gatewayService.getOneGateway(gw.sensor_id).then((res) => {
                this.gateways.push(res);
            });
        }
    }
    showLocation(id) {
        console.log(this.sensors);
        for (let sn of this.sensors) {
            sn.alpha = 0.4;
            if (sn.sensor._id == id) {
                sn.alpha = 1;
            }
        }
    }
};
ReviewDeploymentComponent.ctorParameters = () => [
    { type: _services_deployment_service__WEBPACK_IMPORTED_MODULE_4__["DeploymentService"] },
    { type: _services_sensor_service__WEBPACK_IMPORTED_MODULE_3__["SensorService"] },
    { type: _services_gateway_service__WEBPACK_IMPORTED_MODULE_5__["GatewayService"] },
    { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"] }
];
ReviewDeploymentComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-review-deployment',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./review-deployment.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/review-deployment/review-deployment.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./review-deployment.component.css */ "./src/app/components/review-deployment/review-deployment.component.css")).default]
    })
], ReviewDeploymentComponent);



/***/ }),

/***/ "./src/app/components/sensor-map/sensor-map.component.ts":
/*!***************************************************************!*\
  !*** ./src/app/components/sensor-map/sensor-map.component.ts ***!
  \***************************************************************/
/*! exports provided: SensorMapComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SensorMapComponent", function() { return SensorMapComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");


let SensorMapComponent = class SensorMapComponent {
    constructor() {
        this.lat = 43.879078;
        this.lng = -103.4615581;
        this.markers = [
            // These are all just random coordinates from https://www.random.org/geographic-coordinates/
            { lat: 22.33159, lng: 105.63233, alpha: 1 },
            { lat: 7.92658, lng: -12.05228, alpha: 1 },
            { lat: 48.75606, lng: -118.859, alpha: 1 },
            { lat: 5.19334, lng: -67.03352, alpha: 1 },
            { lat: 12.09407, lng: 26.31618, alpha: 1 },
            { lat: 47.92393, lng: 78.58339, alpha: 1 }
        ];
    }
    ngOnInit() {
    }
    addMarker(lat, lng) {
        this.markers.push({ lat, lng, alpha: 0.4 });
    }
    max(coordType) {
        return Math.max(...this.markers.map(marker => marker[coordType]));
    }
    min(coordType) {
        return Math.min(...this.markers.map(marker => marker[coordType]));
    }
    selectMarker(event) {
        this.selectedMarker = {
            lat: event.latitude,
            lng: event.longitude
        };
    }
};
SensorMapComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-sensor-map',
        template: `
    <agm-map
      [latitude]="lat"
      [longitude]="lng"
      [zoom]="2"
      (mapClick)="addMarker($event.coords.lat, $event.coords.lng)"
    >
      <agm-marker
        *ngFor="let marker of markers"
        [latitude]="marker.lat"
        [longitude]="marker.lng"
        [opacity]="marker.alpha"
        [markerDraggable]="true"
        (markerClick)="selectMarker($event)"
      >
      </agm-marker>
    </agm-map>
    <p *ngIf="selectedMarker">
      Lat: {{ selectedMarker.lat }} Lng: {{ selectedMarker.lng }}
    </p>
  `,
        styles: ["agm-map { height: 300px; /* height is required */ }"]
    })
], SensorMapComponent);



/***/ }),

/***/ "./src/app/components/sensors/sensors.component.css":
/*!**********************************************************!*\
  !*** ./src/app/components/sensors/sensors.component.css ***!
  \**********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".sensor-div{\r\n  border: #bbbbff;\r\n  border-radius: 0.4em;\r\n  border-style: solid;\r\n  border-width: 0.001em;\r\n}\r\n\r\n.sensor-spec{\r\n  border-radius: 5px;\r\n  background: #ddeeff;\r\n  padding: 0.251em;\r\n}\r\n\r\n\r\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9hcHAvY29tcG9uZW50cy9zZW5zb3JzL3NlbnNvcnMuY29tcG9uZW50LmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGVBQWU7RUFDZixvQkFBb0I7RUFDcEIsbUJBQW1CO0VBQ25CLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixtQkFBbUI7RUFDbkIsZ0JBQWdCO0FBQ2xCIiwiZmlsZSI6InNyYy9hcHAvY29tcG9uZW50cy9zZW5zb3JzL3NlbnNvcnMuY29tcG9uZW50LmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5zZW5zb3ItZGl2e1xyXG4gIGJvcmRlcjogI2JiYmJmZjtcclxuICBib3JkZXItcmFkaXVzOiAwLjRlbTtcclxuICBib3JkZXItc3R5bGU6IHNvbGlkO1xyXG4gIGJvcmRlci13aWR0aDogMC4wMDFlbTtcclxufVxyXG5cclxuLnNlbnNvci1zcGVje1xyXG4gIGJvcmRlci1yYWRpdXM6IDVweDtcclxuICBiYWNrZ3JvdW5kOiAjZGRlZWZmO1xyXG4gIHBhZGRpbmc6IDAuMjUxZW07XHJcbn1cclxuXHJcbiJdfQ== */");

/***/ }),

/***/ "./src/app/components/sensors/sensors.component.ts":
/*!*********************************************************!*\
  !*** ./src/app/components/sensors/sensors.component.ts ***!
  \*********************************************************/
/*! exports provided: SensorsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SensorsComponent", function() { return SensorsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _services_sensor_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../services/sensor.service */ "./src/app/services/sensor.service.ts");



let SensorsComponent = class SensorsComponent {
    constructor(sensorService) {
        this.sensorService = sensorService;
    }
    ngOnInit() {
        this.getSensors();
        console.log("hej");
        console.log(this.sensorService);
    }
    getSensors() {
        this.sensorService.getSensors().then(result => {
            console.log(result);
            this.sensors = result;
        });
    }
};
SensorsComponent.ctorParameters = () => [
    { type: _services_sensor_service__WEBPACK_IMPORTED_MODULE_2__["SensorService"] }
];
SensorsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
        selector: 'app-sensors',
        template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./sensors.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/components/sensors/sensors.component.html")).default,
        styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./sensors.component.css */ "./src/app/components/sensors/sensors.component.css")).default]
    })
], SensorsComponent);



/***/ }),

/***/ "./src/app/models/data-deployment.ts":
/*!*******************************************!*\
  !*** ./src/app/models/data-deployment.ts ***!
  \*******************************************/
/*! exports provided: DataDeployment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataDeployment", function() { return DataDeployment; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");

class DataDeployment {
}


/***/ }),

/***/ "./src/app/services/deployment.service.ts":
/*!************************************************!*\
  !*** ./src/app/services/deployment.service.ts ***!
  \************************************************/
/*! exports provided: DeploymentService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeploymentService", function() { return DeploymentService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");




let DeploymentService = class DeploymentService {
    constructor(http) {
        this.http = http;
        this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].apiUrl;
    }
    getDeployments() {
        const url = `${this.apiUrl}/deployment`;
        return this.http
            .get(url)
            .toPromise()
            .then(answer => answer)
            .catch(this.obdelajNapako);
    }
    getOneDeployment(id) {
        const url = `${this.apiUrl}/deployment/` + id;
        return this.http
            .get(url)
            .toPromise()
            .then(answer => answer)
            .catch(this.obdelajNapako);
    }
    updateDeployment(id, body) {
        const url = `${this.apiUrl}/deployment/` + id;
        return this.http
            .put(url, body)
            .toPromise()
            .then(answer => answer)
            .catch(this.obdelajNapako);
    }
    createDeployment(body) {
        const url = `${this.apiUrl}/deployment/`;
        return this.http
            .post(url, body)
            .toPromise()
            .then(answer => answer)
            .catch(this.obdelajNapako);
    }
    obdelajNapako(napaka) {
        console.error('Error ', napaka.error.sporočilo || napaka.error.errmsg || napaka);
        return Promise.reject(napaka.error.sporočilo || napaka.error.errmsg || napaka);
    }
};
DeploymentService.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
];
DeploymentService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    })
], DeploymentService);



/***/ }),

/***/ "./src/app/services/gateway.service.ts":
/*!*********************************************!*\
  !*** ./src/app/services/gateway.service.ts ***!
  \*********************************************/
/*! exports provided: GatewayService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GatewayService", function() { return GatewayService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");




let GatewayService = class GatewayService {
    constructor(http) {
        this.http = http;
        this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].apiUrl;
    }
    getGateways() {
        const url = `${this.apiUrl}/gateway`;
        return this.http
            .get(url)
            .toPromise()
            .then(answer => answer)
            .catch(this.obdelajNapako);
    }
    getOneGateway(id) {
        const url = `${this.apiUrl}/gateway/` + id;
        return this.http
            .get(url)
            .toPromise()
            .then(answer => answer)
            .catch(this.obdelajNapako);
    }
    updateGateway(id, body) {
        const url = `${this.apiUrl}/sensor/` + id;
        return this.http
            .put(url, body)
            .toPromise()
            .then(answer => answer)
            .catch(this.obdelajNapako);
    }
    obdelajNapako(napaka) {
        console.error('Error ', napaka.error.sporočilo || napaka.error.errmsg || napaka);
        return Promise.reject(napaka.error.sporočilo || napaka.error.errmsg || napaka);
    }
};
GatewayService.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
];
GatewayService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    })
], GatewayService);



/***/ }),

/***/ "./src/app/services/sensor.service.ts":
/*!********************************************!*\
  !*** ./src/app/services/sensor.service.ts ***!
  \********************************************/
/*! exports provided: SensorService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SensorService", function() { return SensorService; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm2015/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");




let SensorService = class SensorService {
    constructor(http) {
        this.http = http;
        this.apiUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].apiUrl;
    }
    getSensors() {
        console.log(this.apiUrl);
        const url = `${this.apiUrl}/sensor`;
        return this.http
            .get(url)
            .toPromise()
            .then(answer => answer)
            .catch(this.obdelajNapako);
    }
    getOneSensor(id) {
        const url = `${this.apiUrl}/sensor/` + id;
        return this.http
            .get(url)
            .toPromise()
            .then(answer => answer)
            .catch(this.obdelajNapako);
    }
    updateSensor(id, body) {
        const url = `${this.apiUrl}/sensor/` + id;
        return this.http
            .put(url, body)
            .toPromise()
            .then(answer => answer)
            .catch(this.obdelajNapako);
    }
    obdelajNapako(napaka) {
        console.error('Error ', napaka.error.sporočilo || napaka.error.errmsg || napaka);
        return Promise.reject(napaka.error.sporočilo || napaka.error.errmsg || napaka);
    }
};
SensorService.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"] }
];
SensorService = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Injectable"])({
        providedIn: 'root'
    })
], SensorService);



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const environment = {
    production: false,
    apiUrl: "http://localhost:3000/api",
    mapsKey: "AIzaSyA9amYWGlkh7IzlVQIlZr4YIjHsWU1fHlA"
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm2015/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm2015/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");





if (_environments_environment__WEBPACK_IMPORTED_MODULE_4__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_2__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_3__["AppModule"])
    .catch(err => console.error(err));


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\andra\OneDrive\Desktop\UrbanNoiseSensing\backend\public\UNSfrontend\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main-es2015.js.map