/*
  File -> Modal that allows users to select default images for events
  - Around 15 images are provided, one for each event category
  - Images are fetched from a Supabase image storage bucket
*/

"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  CheckIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/utils/supabase/client";
import { env } from "@/env";

type DefaultImagesButtonProps = {
  onImageChange: (image: string) => void;
};

export default function DefaultImagesButton({
  onImageChange,
}: DefaultImagesButtonProps) {
  const [dialogIsOpen, setDialogIsOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [images, setImages] = useState<string[] | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchDefaultImages = async () => {
      return await supabase.storage
        .from("images")
        .list("events/defaults")
        .then((res) =>
          setImages(
            res?.data?.map(
              (image) =>
                env.NEXT_PUBLIC_SUPABASE_STORAGE_URL +
                "events/defaults/" +
                image.name,
            ) ?? [],
          ),
        );
    };

    fetchDefaultImages().catch((error) => {
      console.error(error);
    });
  }, [supabase]);

  const handleSubmit = () => {
    if (selectedImage) {
      onImageChange(selectedImage);
      setDialogIsOpen(false);
    }
  };

  const ImageCard = ({ image }: { image: string }) => {
    const isSelected = image === selectedImage;

    return (
      <div
        onClick={() => setSelectedImage(image)}
        className={`relative flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-gray-50/50 p-2 ${
          isSelected && "border-2 border-purple-300"
        }`}
      >
        <Image
          src={image}
          alt="default image"
          fill
          sizes="100%"
          style={{
            objectFit: "cover",
          }}
          className="rounded-lg"
        />
        {isSelected && (
          <div className="absolute -right-2 -top-2 rounded-full bg-purple-500 p-1">
            <CheckIcon className="h-5 w-5 text-white" />
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className="flex w-auto flex-row items-center"
        >
          <MagnifyingGlassIcon className="mr-2 h-5 w-5" />
          Browse default images
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <div className="flex flex-row items-center">
          <PhotoIcon className="mr-2 h-8 w-8" color="#4f4f4f" />
          <p className="text-2xl font-bold text-slate-700">Select an image</p>
        </div>
        <Separator />
        <div className="grid h-[450px] w-full grid-cols-1 gap-x-8 gap-y-6 overflow-y-auto pr-8 pt-4 sm:grid-cols-2 md:grid-cols-3 ">
          {images?.map((image, index) => (
            <ImageCard key={index} image={image} />
          ))}
        </div>
        <Separator className="mt-2" />
        <div className="flex flex-row items-center justify-end">
          <Button
            variant="outline"
            className="mx-4 my-4 w-40 justify-center"
            type="button"
            onClick={() => setDialogIsOpen(false)}
          >
            Close
          </Button>
          <Button
            variant="default"
            className="mx-4 my-4 w-40 justify-center"
            type="button"
            onClick={handleSubmit}
          >
            Select
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
