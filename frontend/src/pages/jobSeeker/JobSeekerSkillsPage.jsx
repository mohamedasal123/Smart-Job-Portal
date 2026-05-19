import { useState, useEffect } from 'react';
import { addSkill, getSkills, getSuggestedSkills, removeSkill } from '../../services/jobSeekerDataService';
import SeekerPageHeader from '../../components/jobSeeker/SeekerPageHeader';
import { useToast } from '../../components/useToast';

const SkillChip = ({ skill, onRemove }) => (
  <div className="inline-flex items-center bg-surface-container-low border border-outline-variant rounded-full px-3 py-1.5 gap-2 group">
    <span className="font-body-md text-sm text-on-surface">{skill.name}</span>
    <span className={`material-symbols-outlined ${skill.source === 'cv_parsed' ? 'text-secondary' : 'text-on-surface-variant'} text-[14px]`}
      title={skill.source === 'cv_parsed' ? 'Extracted from CV' : 'Added manually'}>
      {skill.source === 'cv_parsed' ? 'smart_toy' : 'person_add'}
    </span>
    <button onClick={() => onRemove(skill)} className="text-outline-variant hover:text-error transition-colors rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100">
      <span className="material-symbols-outlined text-[16px]">close</span>
    </button>
  </div>
);

const SkillSection = ({ title, icon, items, onRemove }) => (
  <section className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6">
    <h2 className="font-h3 text-h3 text-primary mb-4 flex items-center gap-2 border-b border-outline-variant pb-3">
      <span className="material-symbols-outlined text-secondary">{icon}</span>{title}
    </h2>
    <div className="flex flex-wrap gap-2">
      {items.map(skill => <SkillChip key={skill.id} skill={skill} onRemove={onRemove} />)}
      {items.length === 0 && <p className="text-on-surface-variant text-sm">No {title.toLowerCase()} added yet.</p>}
    </div>
  </section>
);

export default function JobSeekerSkillsPage() {
  const { addToast } = useToast();
  const [skills, setSkills] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [skillsData, suggestedData] = await Promise.all([
          getSkills(),
          getSuggestedSkills(),
        ]);
        setSkills(skillsData);
        setSuggested(suggestedData);
      } catch (error) {
        console.error('Error fetching skills:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRemoveSkill = async (skill) => {
    try {
      await removeSkill(skill.id);
      setSkills(skills.filter(s => s.id !== skill.id));
      addToast({ title: 'Skill removed', message: `${skill.name} has been removed.`, type: 'info' });
    } catch {
      addToast({ title: 'Error', message: 'Could not remove this skill.', type: 'error' });
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (skills.some(s => s.name.toLowerCase() === newSkill.trim().toLowerCase())) {
      addToast({ title: 'Duplicate', message: 'This skill is already in your list.', type: 'error' });
      return;
    }
    const existingSkill = suggested.find(s => s.name.toLowerCase() === newSkill.trim().toLowerCase());
    if (!existingSkill) {
      addToast({ title: 'Skill not found', message: 'Choose a skill from the backend suggestions list.', type: 'error' });
      return;
    }

    await handleAddSuggested(existingSkill);
    setNewSkill('');
  };

  const handleAddSuggested = async (s) => {
    if (skills.some(sk => sk.name.toLowerCase() === s.name.toLowerCase())) return;
    try {
      const obj = { id: s.id, name: s.name, category: s.category, source: 'manual' };
      await addSkill(obj);
      setSkills([...skills, obj]);
      addToast({ title: 'Skill added', message: `${s.name} has been added.`, type: 'success' });
    } catch (error) {
      addToast({ title: 'Error', message: error.message || 'Could not add this skill.', type: 'error' });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full p-12"><span className="material-symbols-outlined animate-spin text-[48px] text-secondary">progress_activity</span></div>;
  }

  const technicalSkills = skills.filter(s => s.category === 'technical' || s.category === 'framework');
  const softSkills = skills.filter(s => s.category === 'soft_skill');
  const tools = skills.filter(s => s.category === 'tool');

  // Filter out already-added skills from suggestions
  const filteredSuggestions = suggested.filter(s => !skills.some(sk => sk.name.toLowerCase() === s.name.toLowerCase()));

  return (
    <div className="p-margin-desktop max-w-7xl mx-auto flex flex-col h-full space-y-gutter">
      <SeekerPageHeader title="My Skills" subtitle="Manage your skills to improve your AI job recommendations." icon="psychology" />

      <div className="flex flex-col lg:flex-row gap-gutter">
        <div className="flex-grow flex flex-col gap-stack-lg lg:w-2/3">
          <form onSubmit={handleAddSkill} className="relative bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
            <input className="w-full bg-transparent border-none focus:ring-0 font-body-md text-on-surface placeholder:text-outline-variant outline-none"
              placeholder="Add a new skill (e.g., GraphQL, Agile)..." type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
            {newSkill && (
              <button type="submit" className="bg-secondary text-on-secondary font-label-sm px-3 py-1.5 rounded flex items-center gap-1 hover:bg-secondary-container transition-colors">
                <span className="material-symbols-outlined text-[16px]">add</span> Add
              </button>
            )}
          </form>
          <SkillSection title="Technical Skills" icon="code" items={technicalSkills} onRemove={handleRemoveSkill} />
          <SkillSection title="Soft Skills" icon="psychology" items={softSkills} onRemove={handleRemoveSkill} />
          <SkillSection title="Tools & Platforms" icon="build" items={tools} onRemove={handleRemoveSkill} />
        </div>

        <aside className="lg:w-1/3 flex flex-col gap-4">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-6 sticky top-24">
            <h3 className="font-h3 text-h3 text-primary mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">tips_and_updates</span>Suggested for You
            </h3>
            <p className="font-body-md text-sm text-on-surface-variant mb-4">Based on skills frequently required by your target roles and recommended jobs.</p>
            <div className="flex flex-col gap-2">
              {filteredSuggestions.map((s, idx) => (
                <button key={idx} onClick={() => handleAddSuggested(s)}
                  className="flex items-center justify-between p-3 border border-outline-variant rounded-lg hover:border-secondary hover:bg-surface-container-low transition-colors group text-left">
                  <div>
                    <span className="font-body-md text-sm text-primary font-bold block">{s.name}</span>
                    <span className="font-label-sm text-[12px] text-on-surface-variant">{s.category === 'soft_skill' ? 'Soft Skill' : s.category === 'tool' ? 'Tool' : 'Technical'}</span>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-secondary transition-colors">add_circle</span>
                </button>
              ))}
              {filteredSuggestions.length === 0 && <p className="text-on-surface-variant text-sm">You've added all suggested skills!</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
