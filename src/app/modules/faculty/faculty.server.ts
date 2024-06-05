import QueryBuilder from '../../builder/QueryBuilder';
import { FacultySearchFields } from './faculty.constent';
import Faculty from './faculty.model';

const getAllFacultyFromDB = async (query: Record<string, unknown>) => {
  const searchQuery = new QueryBuilder(Faculty.find(), query)
    .search(FacultySearchFields)
    .filter()
    .fields()
    .paginate()
    .sort();

  const result = await searchQuery.modelQuery;
  return result;
};

export const FacultyService = {
  getAllFacultyFromDB,
};
