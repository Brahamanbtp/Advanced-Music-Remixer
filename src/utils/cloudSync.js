import { db } from '../firebase'; // Assuming Firebase is used for cloud storage

// Function to save project data to the cloud
export const syncProjectToCloud = async (projectData) => {
  try {
    const docRef = await db.collection('projects').add(projectData);
    console.log('Project saved to cloud with ID: ', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving project to cloud:', error);
    throw error;
  }
};

// Function to load project data from the cloud
export const loadProjectFromCloud = async (projectId) => {
  try {
    const doc = await db.collection('projects').doc(projectId).get();
    if (doc.exists) {
      console.log('Project loaded from cloud:', doc.data());
      return doc.data();
    } else {
      console.log('No such project!');
      return null;
    }
  } catch (error) {
    console.error('Error loading project from cloud:', error);
    throw error;
  }
};

// Function to update project data in the cloud
export const updateProjectInCloud = async (projectId, updatedData) => {
  try {
    await db.collection('projects').doc(projectId).update(updatedData);
    console.log('Project updated in cloud with ID: ', projectId);
  } catch (error) {
    console.error('Error updating project in cloud:', error);
    throw error;
  }
};

// Function to delete project data from the cloud
export const deleteProjectFromCloud = async (projectId) => {
  try {
    await db.collection('projects').doc(projectId).delete();
    console.log('Project deleted from cloud with ID: ', projectId);
  } catch (error) {
    console.error('Error deleting project from cloud:', error);
    throw error;
  }
};
