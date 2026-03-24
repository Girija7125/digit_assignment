import axios from "axios";

const BASE_URL = "http://localhost:8080/digit-assignment";
const MDMS_URL = "http://localhost:8094";

const getRequestInfo = () => ({
  apiId: "Rainmaker",
  ver: ".01",
  ts: Date.now(),
  action: "_create",
  did: "1",
  key: "",
  msgId: "20170310130900|en_IN",
  authToken: localStorage.getItem("authToken") || "",
  userInfo: JSON.parse(localStorage.getItem("user") || "null"),
});

export const createAdvocate = async (advocateData) => {
  const payload = {
    RequestInfo: getRequestInfo(),
    advocates: [advocateData],
  };
  const response = await axios.post(`${BASE_URL}/advocate/v1/_create`, payload);
  return response.data;
};

export const searchAdvocates = async (criteria) => {
  const payload = {
    RequestInfo: getRequestInfo(),
    criteria: [criteria],
    pagination: { limit: 10, offset: 0 },
  };
  const response = await axios.post(`${BASE_URL}/advocate/v1/_search`, payload);
  return response.data;
};

export const updateAdvocate = async (advocateData) => {
  const payload = {
    RequestInfo: getRequestInfo(),
    advocates: [advocateData],
  };
  const response = await axios.post(`${BASE_URL}/advocate/v1/_update`, payload);
  return response.data;
};

export const fetchMasterData = async (moduleName, masterName, tenantId = "pg") => {
  const payload = {
    RequestInfo: getRequestInfo(),
    MdmsCriteria: {
      tenantId,
      moduleDetails: [
        {
          moduleName,
          masterDetails: [{ name: masterName }],
        },
      ],
    },
  };
  const response = await axios.post(`${MDMS_URL}/mdms-v2/v2/_search`, payload);
  return response.data;
};
