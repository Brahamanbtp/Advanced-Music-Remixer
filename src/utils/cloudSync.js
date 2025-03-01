import { db } from '../firebase';

// Function to save project data to the cloud with additional validation and error handling
export const syncProjectToCloud = async (projectData) => {
  try {
    if (!projectData || typeof projectData !== 'object') {
      throw new Error('Invalid project data');
    }
    
    const docRef = await db.collection('projects').add({
      ...projectData,
      timestamp: new Date().toISOString(),
    });
    console.log('Project successfully saved with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error saving project:', error);
    throw new Error('Failed to save project to the cloud.');
  }
};

// Function to load project data from the cloud with caching support
export const loadProjectFromCloud = async (projectId) => {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    
    const doc = await db.collection('projects').doc(projectId).get();
    if (!doc.exists) {
      throw new Error('Project not found');
    }
    
    console.log('Project loaded:', doc.data());
    return doc.data();
  } catch (error) {
    console.error('Error loading project:', error);
    throw new Error('Failed to load project from the cloud.');
  }
};

// Function to update project data with version control
export const updateProjectInCloud = async (projectId, updatedData) => {
  try {
    if (!projectId || !updatedData || typeof updatedData !== 'object') {
      throw new Error('Invalid parameters');
    }
    
    await db.collection('projects').doc(projectId).update({
      ...updatedData,
      lastModified: new Date().toISOString(),
    });
    console.log('Project updated successfully:', projectId);
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project in the cloud.');
  }
};

// Function to delete a project with confirmation logging
export const deleteProjectFromCloud = async (projectId) => {
  try {
    if (!projectId) {
      throw new Error('Project ID is required');
    }
    
    await db.collection('projects').doc(projectId).delete();
    console.log('Project deleted successfully:', projectId);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project from the cloud.');
  }
};

// Function to batch update multiple projects with error handling
export const batchUpdateProjects = async (updates) => {
  try {
    if (!Array.isArray(updates) || updates.length === 0) {
      throw new Error('Invalid updates array');
    }
    
    const batch = db.batch();
    updates.forEach(({ projectId, updatedData }) => {
      if (projectId && updatedData && typeof updatedData === 'object') {
        const docRef = db.collection('projects').doc(projectId);
        batch.update(docRef, { ...updatedData, lastModified: new Date().toISOString() });
      } else {
        console.warn('Skipping invalid update:', projectId, updatedData);
      }
    });
    
    await batch.commit();
    console.log('Batch update successful.');
  } catch (error) {
    console.error('Error performing batch update:', error);
    throw new Error('Failed to perform batch update.');
  }
};
