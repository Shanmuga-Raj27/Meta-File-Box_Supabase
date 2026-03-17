import { getFileIconInfo } from '../utils/fileHelpers';

export default function FileIcon({ fileName, size = 22, style = {} }) {
  const { icon: Icon, color } = getFileIconInfo(fileName);
  return <Icon size={size} color={color} style={style} />;
}
