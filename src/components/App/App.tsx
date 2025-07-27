import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import { useEffect, useState } from "react";
import css from "./App.module.css"
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox";
import Modal from "../Modal/Modal";
import { useDebouncedCallback } from "use-debounce";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import NoteForm from "../NoteForm/NoteForm";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["notes", search, page],
    queryFn: () => fetchNotes(search, page),
    placeholderData: keepPreviousData,
  })

  useEffect(() => {
    setPage(1);
  }, [search])

  const totalPages = data?.totalPages ?? 0;

  const handleCreate = () => {
    setIsModalOpen(true)
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleChange = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    1000
  );
  
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={ handleChange } />
        {isSuccess && totalPages > 1 && <Pagination totalPages={totalPages} page={page} setPage={setPage}/>}
        <button className={css.button} onClick={handleCreate}>Create note +</button>
      </header>
      <main>
        <section>
          {isLoading
            ?
            <Loader />
            :
            isError
              ?
              <ErrorMessage />
              :
              data?.notes !== undefined && <NoteList notes={data?.notes} />
          }
        </section>
      </main>
      {isModalOpen &&
        <Modal onClose={handleClose} >
          <NoteForm onClose={handleClose} />
        </Modal>}
    </div>
  )
}
