/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { supabase } from "../lib/supabase"
import { useEffect, useState } from "react"

export default function Home() {

  const [user, setUser] = useState<any>(null)
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")

  // Fetch bookmarks
  const fetchBookmarks = async (userId: string) => {

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (!error && data) {
      setBookmarks(data)
    }

  }


  // ✅ Restore session + listen for login/logout
  useEffect(() => {

    // Restore existing session
    supabase.auth.getSession().then(({ data }) => {

      if (data.session?.user) {
        setUser(data.session.user)
        fetchBookmarks(data.session.user.id)
      }

    })

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {

        if (session?.user) {
          setUser(session.user)
          fetchBookmarks(session.user.id)
        }
        else {
          setUser(null)
          setBookmarks([])
        }

      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }

  }, [])



  // ✅ Realtime sync across tabs
  useEffect(() => {

    if (!user) return

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchBookmarks(user.id)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }

  }, [user])



  // Add bookmark
  const addBookmark = async () => {

  if (!url || !title || !user) return

  const { error } = await supabase
    .from("bookmarks")
    .insert({
      url,
      title,
      user_id: user.id
    })

  if (!error) {

    setUrl("")
    setTitle("")

   
    fetchBookmarks(user.id)

  }

}




  // Delete bookmark
  const deleteBookmark = async (id: number) => {

    await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)

  }



  // Sign in
  const signInWithGoogle = async () => {

    await supabase.auth.signInWithOAuth({
      provider: "google"
    })

  }



  // Sign out
  const signOut = async () => {

    await supabase.auth.signOut()

  }



  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center px-4">

      <div className="text-center w-full max-w-md">

        <h1 className="text-4xl font-bold text-gray-800 mb-6 tracking-tight">
          Smart Bookmark App
        </h1>


        {/* LOGIN BUTTON */}
        {!user && (

          <button
            onClick={signInWithGoogle}
            className="
              bg-indigo-600
              text-white
              px-6
              py-3
              rounded-xl
              font-semibold
              shadow-sm
              cursor-pointer
              transition-all
              duration-200
              hover:bg-indigo-700
              hover:shadow-md
              hover:scale-[1.03]
              active:bg-indigo-800
              active:scale-[0.98]
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-400
              focus:ring-offset-2
            "
          >
            Sign in with Google
          </button>

        )}



        {/* MAIN APP */}
        {user && (

          <div className="mt-6">

            <p className="mb-4 text-gray-700">
              Logged in as: {user.email}
            </p>


            {/* SIGN OUT */}
            <button
              onClick={signOut}
              className="
                bg-slate-600
                text-white
                px-4
                py-2
                rounded-xl
                font-medium
                cursor-pointer
                transition-all
                duration-200
                hover:bg-slate-700
                hover:shadow-md
                hover:scale-[1.03]
                active:bg-slate-800
                active:scale-[0.98]
                focus:outline-none
                focus:ring-2
                focus:ring-slate-400
                focus:ring-offset-2
                mb-4
              "
            >
              Sign Out
            </button>



            {/* INPUTS */}
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full mb-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="text"
              placeholder="URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border p-2 w-full mb-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />



            {/* ADD BUTTON */}
            <button
              onClick={addBookmark}
              className="
                bg-indigo-500
                text-white
                px-4
                py-2
                rounded-xl
                w-full
                font-medium
                cursor-pointer
                transition-all
                duration-200
                hover:bg-indigo-600
                hover:shadow-md
                hover:scale-[1.02]
                active:bg-indigo-700
                active:scale-[0.98]
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-400
                focus:ring-offset-2
                mb-4
              "
            >
              Add Bookmark
            </button>



            {/* BOOKMARK LIST */}
            {bookmarks.map((bookmark) => (

              <div
                key={bookmark.id}
                className="flex justify-between items-center border p-3 mb-2 rounded-lg bg-white shadow-sm hover:shadow-md transition"
              >

                <div className="text-left">

                  <p className="font-semibold">
                    {bookmark.title}
                  </p>

                  <a
                    href={bookmark.url}
                    target="_blank"
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    {bookmark.url}
                  </a>

                </div>


                <button
                  onClick={() => deleteBookmark(bookmark.id)}
                  className="
                    bg-rose-500
                    text-white
                    px-3
                    py-1
                    rounded-xl
                    font-medium
                    cursor-pointer
                    transition-all
                    duration-200
                    hover:bg-rose-600
                    hover:shadow-md
                    hover:scale-[1.03]
                    active:bg-rose-700
                    active:scale-[0.97]
                    focus:outline-none
                    focus:ring-2
                    focus:ring-rose-400
                    focus:ring-offset-1
                  "
                >
                  Delete
                </button>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  )

}
