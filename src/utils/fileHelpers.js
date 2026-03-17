import {
  FaFilePdf,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFileWord,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileArchive,
  FaFileCode,
  FaFileAlt,
  FaFile,
} from 'react-icons/fa';

const extensionMap = {
  pdf: { icon: FaFilePdf, color: '#e74c3c' },
  // Images
  jpg: { icon: FaFileImage, color: '#8e44ad' },
  jpeg: { icon: FaFileImage, color: '#8e44ad' },
  png: { icon: FaFileImage, color: '#8e44ad' },
  gif: { icon: FaFileImage, color: '#8e44ad' },
  svg: { icon: FaFileImage, color: '#8e44ad' },
  webp: { icon: FaFileImage, color: '#8e44ad' },
  bmp: { icon: FaFileImage, color: '#8e44ad' },
  // Video
  mp4: { icon: FaFileVideo, color: '#e67e22' },
  avi: { icon: FaFileVideo, color: '#e67e22' },
  mkv: { icon: FaFileVideo, color: '#e67e22' },
  mov: { icon: FaFileVideo, color: '#e67e22' },
  webm: { icon: FaFileVideo, color: '#e67e22' },
  // Audio
  mp3: { icon: FaFileAudio, color: '#1abc9c' },
  wav: { icon: FaFileAudio, color: '#1abc9c' },
  ogg: { icon: FaFileAudio, color: '#1abc9c' },
  flac: { icon: FaFileAudio, color: '#1abc9c' },
  // Documents
  doc: { icon: FaFileWord, color: '#2980b9' },
  docx: { icon: FaFileWord, color: '#2980b9' },
  odt: { icon: FaFileWord, color: '#2980b9' },
  rtf: { icon: FaFileWord, color: '#2980b9' },
  // Spreadsheets
  xls: { icon: FaFileExcel, color: '#27ae60' },
  xlsx: { icon: FaFileExcel, color: '#27ae60' },
  csv: { icon: FaFileExcel, color: '#27ae60' },
  // Presentations
  ppt: { icon: FaFilePowerpoint, color: '#d35400' },
  pptx: { icon: FaFilePowerpoint, color: '#d35400' },
  // Archives
  zip: { icon: FaFileArchive, color: '#f39c12' },
  rar: { icon: FaFileArchive, color: '#f39c12' },
  '7z': { icon: FaFileArchive, color: '#f39c12' },
  tar: { icon: FaFileArchive, color: '#f39c12' },
  gz: { icon: FaFileArchive, color: '#f39c12' },
  // Code
  js: { icon: FaFileCode, color: '#f1c40f' },
  jsx: { icon: FaFileCode, color: '#f1c40f' },
  ts: { icon: FaFileCode, color: '#3498db' },
  tsx: { icon: FaFileCode, color: '#3498db' },
  py: { icon: FaFileCode, color: '#3498db' },
  java: { icon: FaFileCode, color: '#e74c3c' },
  html: { icon: FaFileCode, color: '#e67e22' },
  css: { icon: FaFileCode, color: '#3498db' },
  json: { icon: FaFileCode, color: '#f1c40f' },
  xml: { icon: FaFileCode, color: '#e67e22' },
  // Text
  txt: { icon: FaFileAlt, color: '#7f8c8d' },
  md: { icon: FaFileAlt, color: '#7f8c8d' },
  log: { icon: FaFileAlt, color: '#7f8c8d' },
};

export function getFileIconInfo(fileName) {
  const ext = (fileName || '').split('.').pop().toLowerCase();
  return extensionMap[ext] || { icon: FaFile, color: '#95a5a6' };
}

const CATEGORY_COLORS_LIGHT = {
  'Documents': { bg: '#E0F2FE', text: '#0369A1' }, // Sky
  'Images': { bg: '#FCE7F3', text: '#BE185D' },    // Pink
  'Personal': { bg: '#DCFCE7', text: '#15803D' },  // Green
  'Work': { bg: '#FEE2E2', text: '#B91C1C' },      // Red
  'Projects': { bg: '#F3E8FF', text: '#7E22CE' },  // Purple
  'Study': { bg: '#FEF3C7', text: '#A16207' },     // Amber
  'Financial': { bg: '#E0E7FF', text: '#4338CA' }, // Indigo
  'Archives': { bg: '#F1F5F9', text: '#1E293B' },  // Slate
};

const CATEGORY_COLORS_DARK = {
  'Documents': { bg: '#00D4FF', text: '#001E2B' }, // Neon Blue
  'Images': { bg: '#FF00A2', text: '#2B0016' },    // Neon Pink
  'Personal': { bg: '#39FF14', text: '#081E02' },  // Neon Green
  'Work': { bg: '#FF3131', text: '#2B0505' },      // Neon Red
  'Projects': { bg: '#BC13FE', text: '#18022B' },  // Neon Purple
  'Study': { bg: '#FFEA00', text: '#2B2600' },     // Neon Yellow
  'Financial': { bg: '#00E5FF', text: '#00252B' }, // Neon Cyan
  'Archives': { bg: '#E2E8F0', text: '#0F172A' },  // Bright Slate
};

export const getCategoryStyles = (category, theme = 'light') => {
  if (!category) return { bg: '#F3F4F6', text: '#1F2937' };
  const palette = theme === 'dark' ? CATEGORY_COLORS_DARK : CATEGORY_COLORS_LIGHT;
  const foundKey = Object.keys(palette).find(k => k.toLowerCase() === category.toLowerCase());
  return foundKey ? palette[foundKey] : { bg: '#F3F4F6', text: '#1F2937' };
};

export const getTagStyles = (tag, theme = 'light') => {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash) % 360;
  
  if (theme === 'dark') {
    return {
      bg: `hsl(${h}, 100%, 65%)`, // Bright Neon
      text: `hsl(${h}, 100%, 10%)`   // Ultra Dark Visible Text
    };
  }
  
  return {
    bg: `hsl(${h}, 75%, 90%)`,
    text: `hsl(${h}, 70%, 20%)`
  };
};

export function getFileType(fileName) {
  const ext = (fileName || '').split('.').pop().toLowerCase();
  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp'];
  const videoExts = ['mp4', 'avi', 'mkv', 'mov', 'webm'];
  const audioExts = ['mp3', 'wav', 'ogg', 'flac'];
  const officeExts = ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
  const textExts = ['txt', 'md', 'log', 'json', 'xml', 'csv', 'js', 'jsx', 'ts', 'tsx', 'py', 'java', 'html', 'css', 'rtf'];

  if (ext === 'pdf') return 'pdf';
  if (imageExts.includes(ext)) return 'image';
  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';
  if (officeExts.includes(ext)) return 'office';
  if (textExts.includes(ext)) return 'text';
  return 'other';
}

export function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
