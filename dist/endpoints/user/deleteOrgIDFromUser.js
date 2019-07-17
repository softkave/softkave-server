"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function deleteOrgIdFromUser({ user, id }) {
    return __awaiter(this, void 0, void 0, function* () {
        const orgs = [...user.orgs];
        const orgIdIndex = orgs.findIndex(orgId => id === orgId);
        if (orgIdIndex !== -1) {
            /**
             * TODO: look for accepted notifications whose orgIds
             * have not been assigned to the use and assign them
             */
            orgs.splice(orgIdIndex, 1);
            user.orgs = orgs;
            yield user.save();
        }
    });
}
exports.default = deleteOrgIdFromUser;
//# sourceMappingURL=deleteOrgIDFromUser.js.map