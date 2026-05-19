import { ENDPOINTS } from './endpoints';
import { apiRequest } from './httpClient';

export const seekerService = {
  addSkill(skillId) {
    return apiRequest(ENDPOINTS.seekerSkills.add, {
      method: 'POST',
      body: { skill_id: skillId },
    });
  },

  removeSkill(skillId) {
    return apiRequest(ENDPOINTS.seekerSkills.remove(skillId), {
      method: 'DELETE',
    });
  },

  listSavedJobs() {
    return apiRequest(ENDPOINTS.savedJobs.list);
  },

  saveJob(jobId) {
    return apiRequest(ENDPOINTS.savedJobs.save(jobId), {
      method: 'POST',
    });
  },

  unsaveJob(jobId) {
    return apiRequest(ENDPOINTS.savedJobs.unsave(jobId), {
      method: 'DELETE',
    });
  },
};
