import "./App.css";

import React, { useEffect, useState } from "react";
import BranchSelector from "./components/BranchSelector";
import CommitCards from "./components/CommitCards";

const API_URL = `https://api.github.com/repos/tryphotino/photino.NET/commits?per_page=3&sha=`;
async function fetchCommits(branch) {
    const url = `${API_URL}${branch}`;
    return await (await fetch(url)).json();
}

const App = () => {
    const branches = ["master", "debug"];
    const [currentBranch, setCurrentBranch] = useState(null);
    const [commits, setCommits] = useState([]);
    const selectBranch = async (branch) => {
        setCurrentBranch(branch);
        setCommits(await fetchCommits(branch));
    };
    useEffect(() => {
        selectBranch(branches[0]);
    }, []);
    return (
        <div id="content">
            <h1>Latest Photino.NET Commits</h1>
            <BranchSelector
                options={branches}
                value={currentBranch}
                onChange={async (branch) => await this.selectBranch(branch)}
            />
            <p>tryphotino/photino.NET @{currentBranch}</p>
            <CommitCards commits={commits} />
        </div>
    );
}

export default App;
