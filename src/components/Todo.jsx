import {
    List,
    ListItem,
    ListItemText,
    IconButton,
  } from "@mui/material";
  import DeleteIcon from "@mui/icons-material/Delete";
  import { db } from "../firebase";
  import { doc, deleteDoc } from "firebase/firestore";
   
  const Todo = ({ arr }) => (
    <List disablePadding> {}
      <ListItem style={{ color: "white" }}
        divider          
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="Apagar"
            onClick={() => deleteDoc(doc(db, "tm16projetofinal", arr.id))}
          >
            <DeleteIcon style={{ color: 'white' }} />
          </IconButton>
        }
      >
        <ListItemText primary={arr.item.todo} />
      </ListItem>
    </List>
  );
   
  export default Todo;
  