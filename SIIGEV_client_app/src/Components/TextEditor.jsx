import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import {useEffect, useRef} from "react";

const TextEditor = ({content, setContent, files, setFiles}) => {
    const fileInputRef = useRef(null);
    const editor = useEditor({
        extensions: [StarterKit, Underline, BulletList, OrderedList, ListItem, Link],
        content: content,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    useEffect(() => {
        if (files.length === 0 && fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [files]);

    return (
        <div>
            <h5>Crear Aviso</h5>
            <Toolbar editor={editor} />
            <div className="border rounded-bottom p-1 z-1">
                <EditorContent editor={editor} />
            </div>
            <div className="my-2">
                <input className="form-control" type="file" id="formFileMultiple" ref={fileInputRef}
                       accept=".png, .jpeg, .jpg, .pdf, .txt"
                       multiple onChange={(e) => setFiles(e.target.files)}/>
            </div>
        </div>
    );
};

const Toolbar = ({ editor }) => {
    if (!editor) return null;

    return (
        <div className="bg-dark-subtle p-2 rounded-top d-flex flex-row gap-3">
            <div>
                <button onClick={() => editor.chain().focus().toggleBold().run()} className={`shadow-sm border-0 ${editor.isActive("bold") ? "bg-primary-subtle" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M254.04-184.11v-592.02h247.57q70.15 0 127.25 43.36 57.1 43.35 57.1 117.66 0 48.13-21.31 78.43-21.3 30.29-44.89 44.53v.72q30.54 13.63 58.87 47.02t28.33 90.52q0 88.61-66.32 129.19-66.31 40.59-131.31 40.59H254.04Zm135.13-122.3h110.67q43.53 0 55.92-22.95 12.39-22.94 12.39-37.77 0-14.83-12.89-37.89-12.89-23.07-58.39-23.07h-107.7v121.68Zm0-238.22h99.46q31.09 0 47.42-17.38 16.34-17.38 16.34-38.1 0-24-17.47-39.36-17.46-15.36-44.16-15.36H389.17v110.2Z"/></svg>
                </button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`shadow-sm border-0 ${editor.isActive("italic") ? "bg-primary-subtle" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M231.77-207v-68.31h152.69l133.62-409.38H361.39V-753h374.15v68.31H587.15L453.54-275.31h152.38V-207H231.77Z"/></svg>
                </button>
                <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`shadow-sm border-0 ${editor.isActive("underline") ? "bg-primary-subtle" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M253.85-179v-52h452.3v52h-452.3ZM480-306.85q-88.31 0-137.15-53.05Q294-412.95 294-502.16v-297.3h68.37v300.94q0 57.46 30.65 92.03 30.66 34.57 87.01 34.57 56.36 0 87-34.57 30.65-34.57 30.65-92.03v-300.94H666v297.3q0 89.21-48.85 142.26-48.84 53.05-137.15 53.05Z"/></svg>
                </button>
            </div>

            <div>
                <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`shadow-sm border-0 ${editor.isActive("bulletList") ? "bg-primary-subtle" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M301.08-597.69v-52H796v52H301.08Zm0 143.69v-52H796v52H301.08Zm0 143.69v-52H796v52H301.08ZM192.31-595.38q-10.73 0-19.52-8.9t-8.79-20.3q0-11.06 8.79-19.24 8.79-8.18 20.02-8.18t19.52 8.03q8.29 8.03 8.29 19.89 0 10.9-8.14 19.8t-20.17 8.9Zm0 143.3q-10.73 0-19.52-8.68-8.79-8.67-8.79-19.74 0-11.81 8.79-20t20.02-8.19q11.23 0 19.52 8.04t8.29 20.65q0 10.57-8.14 19.24-8.14 8.68-20.17 8.68Zm0 144.08q-10.73 0-19.52-8.9T164-337.19q0-11.07 8.79-19.25t20.02-8.18q11.23 0 19.52 8.03t8.29 19.9q0 10.89-8.14 19.79-8.14 8.9-20.17 8.9Z"/></svg>
                </button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`shadow-sm border-0 ${editor.isActive("orderedList") ? "bg-primary-subtle" : ""}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="M164-164v-35.69h96V-236h-48v-35.69h48V-308h-96v-35.69h113.85q7.58 0 12.71 5.13 5.13 5.13 5.13 12.71v55.7q0 7.58-5.13 12.71-5.13 5.13-12.71 5.13 7.58 0 12.71 5.13 5.13 5.13 5.13 12.72v52.61q0 7.59-5.13 12.72-5.13 5.13-12.71 5.13H164Zm0-226.15V-480q0-7.58 5.13-12.72 5.13-5.13 12.72-5.13H260v-36.3h-96v-35.7h113.85q7.58 0 12.71 5.13 5.13 5.14 5.13 12.72v72q0 7.58-5.13 12.72-5.13 5.13-12.71 5.13h-78.16v36.3h96v35.7H164Zm48-226.16v-144h-48V-796h83.69v179.69H212ZM372.31-250v-52H796v52H372.31Zm0-204v-52H796v52H372.31Zm0-204v-52H796v52H372.31Z"/></svg>
                </button>
            </div>
        </div>
    );
};

export default TextEditor;
