import React from 'react';
import {Path, Svg, G} from 'react-native-svg';
import {useTheme} from 'styled-components/native';
import {White} from '../../../../styles/colors';

const RampLogoSvg: React.FC<{
  isDark: boolean;
  iconOnly: boolean;
  width: number;
  height: number;
}> = ({isDark, iconOnly, width, height}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox={iconOnly ? '0 -10 50 55' : '0 0 148 32'}>
      <G fill="none" fill-rule="evenodd">
        <Path
          id="ramp-path-icon1"
          fill="#0A6E5C"
          d="M34.4433 18.8309L28.3845 24.912C27.8712 25.4272 27.8717 26.2647 28.3855 26.7792L33.0155 31.4158C33.8046 32.1947 35.0946 32.1947 35.8837 31.4158L50.0747 17.4093C50.8638 16.6305 50.8638 15.3571 50.0747 14.5783L35.8837 0.584122C35.0946 -0.194707 33.8046 -0.194707 33.0155 0.584122L28.3855 5.22078C27.8717 5.73535 27.8712 6.57281 28.3845 7.08795L34.4433 13.1691C36.0215 14.7267 36.0215 17.2733 34.4433 18.8309Z"
        />
        <Path
          id="ramp-path-icon2"
          fill="#21BF73"
          d="M16.2232 18.8309L22.282 24.912C22.7953 25.4272 22.7948 26.2647 22.281 26.7792L17.651 31.4158C16.8619 32.1947 15.5719 32.1947 14.7828 31.4158L0.591812 17.4093C-0.197271 16.6305 -0.197271 15.3571 0.591812 14.5783L14.7828 0.584122C15.5719 -0.194707 16.8619 -0.194707 17.651 0.584122L22.281 5.22078C22.7948 5.73535 22.7953 6.57281 22.282 7.08795L16.2232 13.1691C14.645 14.7267 14.645 17.2733 16.2232 18.8309Z"
        />
        <Path
          id="ramp-path-icon3"
          fill="#21BF73"
          d="M17.8128 17.157C17.1737 16.518 17.1737 15.482 17.8128 14.843L24.1765 8.47926C24.8155 7.84025 25.8515 7.84025 26.4905 8.47926L32.8542 14.843C33.4932 15.482 33.4932 16.518 32.8542 17.157L26.4905 23.5207C25.8515 24.1598 24.8155 24.1598 24.1765 23.5207L17.8128 17.157Z"
        />
        {iconOnly ? null : (
          <>
            <Path
              id="ramp-path-r"
              fill={isDark ? White : '#22272F'}
              d="M77.8051 25.6003H73.2829L70.7889 19.0761C70.5879 18.5622 70.2773 18.2043 69.857 18.0025C69.4551 17.8006 68.9435 17.6996 68.3223 17.6996H65.5542V25.6003H61.3335V6H70.0215C72.2871 6 74.0046 6.49551 75.174 7.48654C76.3433 8.47757 76.928 9.89988 76.928 11.7535C76.928 13.0565 76.5809 14.176 75.8866 15.112C75.2105 16.0479 74.233 16.7178 72.954 17.1215C74.1051 17.3601 74.9365 18.1585 75.4481 19.5165L77.8051 25.6003ZM69.3911 14.4237C70.6153 14.4237 71.5106 14.2219 72.077 13.8181C72.6434 13.396 72.9266 12.7445 72.9266 11.8636C72.9266 10.9827 72.6434 10.3403 72.077 9.93659C71.5106 9.51448 70.6153 9.30343 69.3911 9.30343H65.4993V14.4237H69.3911Z"
            />
            <Path
              id="ramp-path-a"
              fill={isDark ? White : '#22272F'}
              d="M94.3864 11.6434V25.6003H90.3028V23.5357C89.8826 24.2514 89.2888 24.8112 88.5214 25.2149C87.754 25.6187 86.8861 25.8206 85.9177 25.8206C84.7118 25.8206 83.6429 25.5269 82.7111 24.9397C81.7975 24.3524 81.0758 23.5173 80.546 22.4346C80.0344 21.3334 79.7786 20.0671 79.7786 18.6356C79.7786 17.2041 80.0344 15.9286 80.546 14.8091C81.0758 13.6896 81.8067 12.8271 82.7385 12.2215C83.6703 11.5975 84.7301 11.2855 85.9177 11.2855C86.8861 11.2855 87.754 11.4965 88.5214 11.9186C89.2888 12.3407 89.8826 12.9097 90.3028 13.6254V11.6434H94.3864ZM87.1236 22.6548C88.1468 22.6548 88.9325 22.3061 89.4806 21.6087C90.0287 20.9113 90.3028 19.9019 90.3028 18.5806C90.3028 17.2592 90.0287 16.2498 89.4806 15.5524C88.9325 14.8367 88.1468 14.4788 87.1236 14.4788C86.1004 14.4788 85.3056 14.8458 84.7392 15.5799C84.1728 16.314 83.8896 17.3326 83.8896 18.6356C83.8896 19.9386 84.1637 20.9388 84.7118 21.6362C85.2782 22.3153 86.0822 22.6548 87.1236 22.6548Z"
            />
            <Path
              id="ramp-path-m"
              fill={isDark ? White : '#22272F'}
              d="M114.719 11.2855C116.309 11.2855 117.487 11.7718 118.255 12.7445C119.04 13.6988 119.433 15.167 119.433 17.1491V25.6003H115.295V17.2867C115.295 16.314 115.139 15.6166 114.829 15.1945C114.518 14.7541 114.007 14.5339 113.294 14.5339C112.454 14.5339 111.805 14.8275 111.348 15.4148C110.891 16.002 110.663 16.8279 110.663 17.8923V25.6003H106.524V17.2867C106.524 16.3324 106.36 15.635 106.031 15.1945C105.721 14.7541 105.218 14.5339 104.524 14.5339C103.683 14.5339 103.026 14.8275 102.55 15.4148C102.094 16.002 101.865 16.8279 101.865 17.8923V25.6003H97.7269V15.635C97.7269 14.1485 97.6538 12.8179 97.5076 11.6434H101.399L101.646 13.7355C102.066 12.9464 102.651 12.3407 103.4 11.9186C104.167 11.4965 105.045 11.2855 106.031 11.2855C108.096 11.2855 109.466 12.148 110.142 13.8732C110.599 13.084 111.229 12.46 112.033 12.0012C112.855 11.5241 113.751 11.2855 114.719 11.2855Z"
            />
            <Path
              id="ramp-path-p"
              fill={isDark ? White : '#22272F'}
              d="M131.194 11.2855C132.382 11.2855 133.442 11.5975 134.374 12.2215C135.305 12.8271 136.027 13.6896 136.539 14.8091C137.069 15.9286 137.333 17.2041 137.333 18.6356C137.333 20.0671 137.078 21.3334 136.566 22.4346C136.055 23.5173 135.333 24.3524 134.401 24.9397C133.469 25.5269 132.4 25.8206 131.194 25.8206C130.226 25.8206 129.358 25.6187 128.591 25.2149C127.823 24.8112 127.239 24.2514 126.837 23.5357V32H122.698V15.635C122.698 14.1485 122.625 12.8179 122.479 11.6434H126.371L126.645 13.9558C127.01 13.1299 127.595 12.4784 128.399 12.0012C129.221 11.5241 130.153 11.2855 131.194 11.2855ZM130.016 22.6548C131.039 22.6548 131.825 22.3153 132.373 21.6362C132.921 20.9388 133.195 19.9386 133.195 18.6356C133.195 17.3326 132.912 16.314 132.345 15.5799C131.797 14.8458 131.021 14.4788 130.016 14.4788C128.993 14.4788 128.198 14.8367 127.631 15.5524C127.083 16.2498 126.809 17.2592 126.809 18.5806C126.809 19.9019 127.083 20.9113 127.631 21.6087C128.198 22.3061 128.993 22.6548 130.016 22.6548Z"
            />
          </>
        )}
      </G>
    </Svg>
  );
};

const RampLogo = ({
  width,
  height,
  iconOnly = false,
}: {
  width?: number;
  height?: number;
  iconOnly?: boolean;
}) => {
  const theme = useTheme();
  const widthSize = width ? width : iconOnly ? 33 : 96;
  const heightSize = height ? height : 32;

  return (
    <RampLogoSvg
      isDark={theme.dark}
      iconOnly={iconOnly}
      width={widthSize}
      height={heightSize}
    />
  );
};

export default RampLogo;