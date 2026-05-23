import { ENDPOINTS } from './endpoints';
import { apiRequest } from './httpClient';

export const seekerService = {
  addSkill(skill) {
    const body = typeof skill === 'object'
      ? {
          skill_id: skill.id || skill.skill_id,
          name: skill.id || skill.skill_id ? undefined : skill.name,
          type: skill.type,
        }
      : { skill_id: skill };

    return apiRequest(ENDPOINTS.seekerSkills.add, {
      method: 'POST',
      body,
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
