import { useEffect, useState } from "react";
import axios from "axios";
let token = "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"
function App() {
  const [getSearch, setSearch] = useState("");
  const [githubData, setGithubData] = useState([]);
  const [imgUrl,setImgUrl] = useState("");
  const [debounceTimer, setDebouncedTimer] = useState(null)

  useEffect(() => {
    const fetchGithub = async (searchTerm) => {
      try {
        const { data } = await axios.get(`https://api.github.com/search/users?q=${searchTerm}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
);      const {items} = data;
        setGithubData(items);
      } catch (error) {
        console.log(error);
      }
    };

    if (debounceTimer !== 0) {
      clearTimeout(debounceTimer);
    }

    const newTimer = setTimeout(async () => {
        if (getSearch?.length > 1) {
          fetchGithub(getSearch);
        }else{
          setImgUrl("")
        }
    }, 600);

    setDebouncedTimer(newTimer);


    
  }, [getSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const {avatar_url} = githubData.slice(0, 1)[0];
    setImgUrl(avatar_url);
  }

  return (
      <form style={{width: "100%", height: "100%", display: "flex", justifyContent: 'center', alignItems: "center", flexDirection: "column"}} onSubmit={(e) => handleSubmit(e)}>
        <span style={{fontSize: "1.3rem"}}>Use up & down arrows to navigate suggestions</span>
        <label htmlFor="github-suggestions-choice"></label>
        <input
          list="github-suggestions"
          id="github-suggestions-choice"
          name="github-suggestions-choice"
          onInput={(e) => setSearch(e.target.value)}
          value={getSearch}
          style={{height: "3rem", width: "50%", padding: "0.5rem", marginTop: "1rem"}}
        />

        <datalist id="github-suggestions">
          {githubData?.length > 0 &&
            githubData.map((_, ind) => (
              <option key={ind} value={`${_.login}`}>{`${_.login}`}</option>
            ))}
        </datalist>

        <div style={{height: "300px", width: "300px", margin: '2rem', border: "none",  borderRadius: "50%", overflow: "hidden"}}>
            {imgUrl?.length > 0 && <img src={imgUrl} alt="git_photo" style={{height: "100%", width: "100%", objectFit: "cover"}}/>}
        </div>
      </form>
  );
}

export default App;
