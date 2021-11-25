import { StringBiRecordType } from '~types/dto';

export const exportApi = {
  toExcel: `${SERVER_PATH}/export/excel`
};

export const vidIqApi = (toSearch: string): StringBiRecordType => ({
  hotterSearch: `https://app.vidiq.com/v0/hottersearch?q=${toSearch}&im=4.5&group=V5`
});
