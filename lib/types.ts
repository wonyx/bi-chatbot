export type DataPart = { type: 'append-message'; message: string };

export type ReportList = {
  items: Array<ReportListItem>;
  totalCount: number;
  hasMore: boolean;
};
export type ReportListItem = {
  id: string;
  title: string;
};
