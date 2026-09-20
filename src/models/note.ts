export interface Note {
  id: string;
  title: string;
  body: string;
  updatedAt: number;
  createdAt: number;
  tags?: string;
}
