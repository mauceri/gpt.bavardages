import { SignedIn, UserButton, useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import {
  FolderOutlined,
} from '@ant-design/icons';
export default function Contextes() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [contextes, setContextes] = useState([]);

  useEffect(() => {
    (async () => {

      if (user) {
        const results = await fetch("/api/queryMDB?op=list_contexts&user=" + user?.id).then(response => response.json());
        setContextes(results);
      }
    })();
  }, [user]);

  return (
    <div className="contextes">
      <span><FolderOutlined style={{fontSize: 20}}/> </span>
      <SignedIn>
        <ul>
          {contextes.map((contexte: any) => {
            if (contexte !== null) {
              return <li key={contexte._id}>{contexte.name as string}</li>
          }})}
        </ul>
      </SignedIn>
    </div>
  )
}