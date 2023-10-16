import {H3, Paragraph} from '../../../styled/Text';
import Button from '../../../button/Button';
import DeviceFoundIconSvg from '../../../../../assets/img/icon-device-found.svg';
import {
  ActionsRow,
  DescriptionRow,
  Header,
  IconRow,
  Wrapper,
} from '../connect-ledger.styled';

interface Props {
  onLearnHow: () => void;
}

export const DeviceFound: React.FC<Props> = props => {
  return (
    <Wrapper>
      <Header>
        <H3>Device Found</H3>
      </Header>

      <DescriptionRow>
        <Paragraph>
          Prior to continuing, please make sure blind signing is enabled on your
          Ledger wallet.
        </Paragraph>
      </DescriptionRow>

      <IconRow>
        <DeviceFoundIconSvg />
      </IconRow>

      <ActionsRow>
        <Button onPress={props.onLearnHow}>Learn How</Button>
      </ActionsRow>
    </Wrapper>
  );
};
