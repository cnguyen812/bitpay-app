import {H3, Paragraph} from '../../../../components/styled/Text';
import {
  ViaBluetoothButton,
  ViaUsbButton,
} from '../components/ViaTransportButton';
import {
  ActionsRow,
  DescriptionRow,
  Header,
  Wrapper,
} from '../connect-ledger.styled';

interface Props {
  error: string;
  onConnectBle: () => void;
  onConnectHid: () => void;
}

export const PairingError: React.FC<Props> = props => {
  return (
    <Wrapper>
      <Header>
        <H3>An Error Has Occured</H3>
      </Header>

      <DescriptionRow>
        <Paragraph>{props.error}</Paragraph>
      </DescriptionRow>

      <ActionsRow>
        <ViaBluetoothButton onPress={props.onConnectBle}>
          Connect via Bluetooth
        </ViaBluetoothButton>

        <ViaUsbButton secondary={true} onPress={props.onConnectHid}>
          Connect via USB
        </ViaUsbButton>
      </ActionsRow>
    </Wrapper>
  );
};
