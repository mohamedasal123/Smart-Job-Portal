import { ENDPOINTS } from './endpoints';
import { apiRequest } from './httpClient';

export const lookupService = {
  listSkills() {
    return apiRequest(ENDPOINTS.skills.list);
  },
};
