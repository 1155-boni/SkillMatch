import React from 'react';

function SearchPage() {
  const [searchTerm, setSearchTerm] = React.useState('');

  function handleSearch(event) {
    setSearchTerm(event.target.value);
  }

  return (
    <div className="w-[512px] max-w-[960px] py-5">
      <h2 className="text-[#121416] text-[28px] font-bold leading-tight px-4 text-center pb-3">Search Jobs</h2>
      <div className="px-4">
        <input
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by skill or category"
          className="form-input w-full h-14 p-4 mb-4 bg-[#f1f2f4] rounded-xl"
        />
        <p>Results for: {searchTerm}</p>
      </div>
    </div>
  );
}

export default SearchPage;