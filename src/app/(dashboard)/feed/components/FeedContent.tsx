"use client";

import { useState, useEffect } from "react";
import FeedFilters from "./FeedFilters";
import PostCard from "./PostCard";
import SetupModal from "./SetupModal";
import { PostResponse, PostCategoryResponse } from "../services/post.service";
import { profileSetupService } from "../services/profile-setup.service";

interface FeedContentProps {
  posts: PostResponse[];
  categories: PostCategoryResponse[];
  userId: number;
  studentId: number;
}

export default function FeedContent({ posts, categories, userId, studentId }: FeedContentProps) {
  const [selectedCategory, setSelectedCategory] = useState("All categories");
  const [showSetup, setShowSetup] = useState(false);
  const [checking, setChecking] = useState(true);
  const [userSetup, setUserSetup] = useState<{ career: string; semester: number } | null>(null);

  useEffect(() => {
    checkUserSetup();
  }, []);

  const checkUserSetup = async () => {
    // Primero verificar localStorage
    const savedSetup = localStorage.getItem("userSetup");
    
    if (savedSetup) {
      const data = JSON.parse(savedSetup);
      if (data.hasSetup) {
        setUserSetup({ career: data.career, semester: data.semester });
        setShowSetup(false);
        setChecking(false);
        return;
      }
    }
    
    // Si no está en localStorage, verificar en el backend
    if (userId) {
      const result = await profileSetupService.hasUserSetup(userId);
      if (result.hasSetup) {
        setShowSetup(false);
      } else {
        setShowSetup(true);
      }
    } else {
      setShowSetup(true);
    }
    setChecking(false);
  };

  const handleSetupComplete = (data: { career: string; semester: number }) => {
    setUserSetup(data);
    setShowSetup(false);
  };

  // Resto del código igual...
}