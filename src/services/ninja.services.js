import axios from "axios";

const API_URL = `${process.env.REACT_APP_API_URL}/api/ninja`;

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ORGANISATION LEVEL

export const getOrganisation = (orgId) => {
  const params = {};
  if (orgId) params.orgId = orgId;

  return client.get("/organisation", { params });
};

export const getDevices = async (orgId, options = {}) => {
  const params = { orgId };
  params.source = "api";

  if (options.search) params.search = options.search;
  if (options.sortBy) params.sortBy = options.sortBy;
  if (options.sortDir) params.sortDir = options.sortDir;
  if (options.page) params.page = options.page;
  if (options.pageSize) params.pageSize = options.pageSize;

  return await client.get("/devices", { params });
};



// DEVICE LEVEL

export const getDevice = (deviceId) => {
  return client.get(`/device/${deviceId}`);
};

export const getDeviceLastLogged = (deviceId) => {
  return client.get(`/device/${deviceId}/last-logged`);
};

export const getDeviceJobs = (deviceId) => {
  return client.get(`/device/${deviceId}/jobs`);
};

export const getDeviceActivities = (
  deviceId,
  {
    pageSize,
    olderThan,
    newerThan,
    activityType,
    status,
    seriesUid,
    lang,
    tz,
  } = {}
) => {
  const params = {};

  if (pageSize) params.pageSize = pageSize;
  if (olderThan) params.olderThan = olderThan;
  if (newerThan) params.newerThan = newerThan;
  if (activityType) params.activityType = activityType;
  if (status) params.status = status;
  if (seriesUid) params.seriesUid = seriesUid;
  if (lang) params.lang = lang;
  if (tz) params.tz = tz;

  return client.get(`/device/${deviceId}/activities`, { params });
};