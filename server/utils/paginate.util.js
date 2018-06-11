const paginateResponse = (data, page, limit) => {
  const startIndex = page <= 1 ? 0 : (limit * (page - 1) );
  const offSetIndex = (limit + startIndex) - 1;
  if(!data.length){
    return [];
  }
  return data.slice(startIndex, offSetIndex + 1);
};

export default paginateResponse;
