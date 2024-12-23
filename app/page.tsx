'use client'
import Image from "next/image";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
const Home = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/login');
  }, [router]); 
  return <div>Loading...</div>; 
};
export default Home;
