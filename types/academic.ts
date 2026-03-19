export interface AcademicResource {
  id: string;
  title: string;
  course_code: string;
  year: number;
  semester: number;
  type: 'slide' | 'past_question';
  file_url: string;
  download_count: number;
}



