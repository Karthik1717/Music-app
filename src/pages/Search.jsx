import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import { Error, Loader } from "../components";
import { useGetSongsBySearchQuery } from "../redux/services/shazamCore";

import { Link } from "react-router-dom";

import PlayPause from "../components/PlayPause";
import { playPause, setActiveSong } from "../redux/features/playerSlice";
import { useDispatch } from "react-redux";

const SongCard = ({ song, isPlaying, activeSong, data, i }) => {
	// console.log(song);
	const dispatch = useDispatch();

	const handlePauseClick = () => {
		dispatch(playPause(false));
	};

	const handlePlayClick = () => {
		dispatch(setActiveSong({ song, data, i }));
		dispatch(playPause(true));
	};

	console.log(song, "songdata");
	return (
		<div className='flex flex-col w-[250px] p-4 bg-white/5 bg-opacity-80 backdrop-blur-sm animate-slideup rounded-lg cursor-pointer'>
			<div className='relative w-full h-56 group'>
				<div
					className={`absolute inset-0 justify-center items-center bg-black bg-opacity-50 group-hover:flex ${
						activeSong?.title === song.title
							? "flex bg-black bg-opacity-70"
							: "hidden"
					}`}
				>
					<PlayPause
						isPlaying={isPlaying}
						activeSong={activeSong}
						song={song}
						handlePause={handlePauseClick}
						handlePlay={handlePlayClick}
					/>
				</div>
				<img alt='song' src={song.images?.coverart} />
			</div>
			<div className='mt-4 flex flex-col'>
				<p className='font-semibold text-lg text-white truncate'>
					<Link to={`/songs/${song?.key}`}>{song.title}</Link>
				</p>
				<p className='text-sm truncate text-gray-300 mt-1'>
					<Link
						to={
							song.artists
								? `/artists/${song?.artists[0].adamid}`
								: `/top-artists`
						}
					>
						{song.subtitle}
					</Link>
				</p>
			</div>
		</div>
	);
};

const Search = () => {
	const { searchTerm } = useParams();
	const { activeSong, isPlaying } = useSelector((state) => state.player);
	const { data, isFetching, error } = useGetSongsBySearchQuery(searchTerm);

	const songs = data?.tracks?.hits?.map((song) => song.track);

	if (isFetching) return <Loader title='Loading top charts' />;

	if (error) return <Error />;
	console.log(data, "data");

	// console.log(country);
	return (
		<div className='flex flex-col'>
			<h2 className='font-bold text-3xl text-white text-left mt-4 mb-10'>
				Showing Results for{" "}
				<span className='font-black'>{searchTerm}</span>
			</h2>

			<div className='flex flex-wrap sm:justify-start justify-center gap-8'>
				{data?.tracks?.hits?.map((song, i) => (
					<SongCard
						key={song.track?.key}
						song={song.track}
						isPlaying={isPlaying}
						activeSong={activeSong}
						data={data}
						i={i}
					/>
				))}
			</div>
		</div>
	);
};

export default Search;
