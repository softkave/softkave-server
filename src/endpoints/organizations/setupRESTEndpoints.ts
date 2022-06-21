import { wrapEndpointREST } from "../utils";
import { Express } from "express";
import { IBaseContext } from "../contexts/IBaseContext";
import createOrganization from "./createOrganization/handler";
import getUserOrganizations from "./getUserOrganizations/handler";
import organizationExists from "./organizationExists/handler";
import updateOrganization from "./updateOrganization/handler";

const baseURL = "/api/organizations";

export default function setupOrganizationsRESTEndpoints(
    ctx: IBaseContext,
    app: Express
) {
    const endpoints = {
        organizationExists: wrapEndpointREST(organizationExists, ctx),
        createOrganization: wrapEndpointREST(createOrganization, ctx),
        getUserOrganizations: wrapEndpointREST(getUserOrganizations, ctx),
        updateOrganization: wrapEndpointREST(updateOrganization, ctx),
    };

    app.post(`${baseURL}/organizationExists`, endpoints.organizationExists);
    app.post(`${baseURL}/createOrganization`, endpoints.createOrganization);
    app.post(`${baseURL}/getUserOrganizations`, endpoints.getUserOrganizations);
    app.post(`${baseURL}/updateOrganization`, endpoints.updateOrganization);
}
