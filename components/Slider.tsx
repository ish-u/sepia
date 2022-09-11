import Card from "./Card";

const Slider = ({
  albums,
  playlists,
  artists,
  title,
  type,
}: {
  albums?: SpotifyApi.AlbumObjectFull[];
  playlists?: SpotifyApi.PlaylistObjectFull[];
  artists?: SpotifyApi.ArtistObjectFull[];
  type: "album" | "artist" | "playlist";
  title: string;
}) => {
  return (
    <div className="flex flex-col">
      <div className="text-3xl font-bold mt-4 mb-2">{title}</div>
      <div className="flex flex-row mb-2 py-4 overflow-x-scroll">
        {type === "album" &&
          albums &&
          albums.map((album) => (
            <div className="mr-4" key={album.id}>
              <Card
                id={album.id}
                img={album.images[0]}
                rounded={false}
                title={album.name}
                subtitle={album.type}
                type={type}
                uri={album.uri}
              />
            </div>
          ))}

        {type === "playlist" &&
          playlists &&
          playlists.map((playlist) => (
            <div className="mr-4" key={playlist.id}>
              <Card
                id={playlist.id}
                img={playlist.images[0]}
                rounded={false}
                title={playlist.name}
                subtitle={playlist.type}
                type={type}
                uri={playlist.uri}
              />
            </div>
          ))}

        {type === "artist" &&
          artists &&
          artists.map((artist) => (
            <div className="mr-4" key={artist.id}>
              <Card
                id={artist.id}
                img={artist.images[0]}
                rounded={true}
                title={artist.name}
                subtitle={artist.type}
                type="artist"
                uri={artist.uri}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Slider;
