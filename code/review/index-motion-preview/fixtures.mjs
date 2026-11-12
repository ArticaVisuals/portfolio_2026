// Local review fixtures only. They never enter production CMS code or defaults.
export const projects = [
  ['Gaia', 'Visual Identity', 'UX/UI', 'Strategy', 'Nature', 2026, 'gaia'],
  ['AirPods Pro 3', 'Visual Identity', '2D Motion', '3D Motion', 'Technology', 2025, 'airpods'],
  ['Peak Energy', '2D Motion', '3D Motion', 'Social Media', 'Technology', 2026, 'peak-energy'],
  ['Simon & Schuster', 'Strategy', 'Visual Identity', 'Editorial', 'Literature', 2024, 'simon-schuster'],
  ['National Park Playing Cards', 'Product', 'Packaging', '', 'Nature', 2019, 'national-park-cards'],
  ['Caliper Sans', 'Type Design', 'Visual Identity', '', 'Technology', 2026, 'gaia'],
  ['Motion Connect 2025', '2D Motion', '3D Motion', 'Social Media', 'Education', 2025, 'airpods'],
  ['Yomo', 'Visual Identity', 'UX/UI', '', 'Health', 2024, 'peak-energy'],
  ['Highland Harvests', 'Visual Identity', 'Packaging', 'Product', 'Nature', 2024, 'simon-schuster'],
  ['Weaponized Innocence', 'Editorial', 'Product', '', 'Human Rights', 2024, 'national-park-cards'],
  ['Seek Truth', 'Editorial', 'Visual Identity', '', 'Human Rights', 2023, 'gaia'],
  ['Independent Lens', 'Editorial', 'Visual Identity', '', 'Human Rights', 2023, 'airpods'],
].map(([title,category1,category2,category3,industry,year,image],i)=>({
 title,category1,category2,category3,industry,year,sortOrder:i+1,
 slug:`preview-${i+1}`,thumbnail:`/samples/${image}.jpg`,thumbnailStroke:true,
}));
export function cmsRows() {
 const fields={title:'oeXZcmPna',slug:'pdXVG_fBO',sortOrder:'DLBifmgp1',category1:'kuvJcmOFr',category2:'VV1CggU2J',category3:'E6OpH0hSs',thumbnail:'Jy7hBJady',year:'QZqSK_3OF',industry:'mBIilFqVM',thumbnailStroke:'OHdUYs6Mo'};
 return projects.map(p=>({slug:p.slug,data:Object.fromEntries(Object.entries(fields).map(([key,id])=>[id,{value:p[key]}]))}));
}
