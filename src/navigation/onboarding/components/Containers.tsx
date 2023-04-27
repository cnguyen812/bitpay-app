import styled from 'styled-components/native';
import {HEIGHT} from '../../../components/styled/Containers';
import { Image } from 'react-native';

export const OnboardingImage = styled(Image)<{
  widthPct?: number;
  heightPct?: number;
}>`
  height: ${({widthPct}) => HEIGHT * (widthPct ? widthPct : 0.3)}px;
  width: ${({heightPct}) => HEIGHT * (heightPct ? heightPct : 0.3)}px;
`;
