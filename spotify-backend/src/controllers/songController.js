import { v2 as cloudinary } from 'cloudinary'
import songModel from '../models/songModel.js'


const addSong = async (req, res) => {
    try {
        const name = req.body.name;
        const desc = req.body.desc;
        const album = req.body.album;
        const audioFile = req.files.audio[0];
        const imageFile = req.files.image[0];
//         console.log(audioFile);
// console.log(imageFile);
        if (!audioFile || !imageFile) {
            throw new Error('Audio or Image file not provided');
        }
        const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: "video" });
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const duration = `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`

        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration
        }

        const song = songModel(songData);
        await song.save();

        res.json({ success: true, message: "Song Added" })

       // console.log(name, desc, album, audioUpload, imageUpload)
    } catch (error) {
        // res.json({ success: false });
        console.error('Error uploading files:', error); // Log the specific error
        res.status(500).json({ success: false, message: error.message });
    }
}

const listSong = async (req, res) => {
    try {
        const allSongs = await songModel.find({});
        res.json({success:true,songs:allSongs});
    } catch (error) {
        res.json({success:false})
    }
}


const removeSong = async (req,res) =>{
    try {
        await songModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Song removed"})
    } catch (error) {
        res.json({success:false})
    }
}
// const removeSong = async (req, res) => {
//     try {
//         const { id } = req.body;

//         // Validate the ID
//         if (!id) {
//             return res.status(400).json({ success: false, message: "No song ID provided" });
//         }

//         // Find and delete the song
//         const deletedSong = await songModel.findByIdAndDelete(id);

//         // If the song doesn't exist
//         if (!deletedSong) {
//             return res.status(404).json({ success: false, message: "Song not found" });
//         }

//         // Success response
//         res.json({ success: true, message: "Song removed" });
//     } catch (error) {
//         // Error response
//         res.status(500).json({ success: false, message: "Error removing song", error: error.message });
//     }
// };


export { addSong, listSong, removeSong }  