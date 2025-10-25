interface HeaderProps {
  handleDrawerToggle: () => void;
}

const Header = ({ handleDrawerToggle }: HeaderProps) => {
  return (
    <div className="bg-gray-800 p-4">
      <button onClick={handleDrawerToggle}>
        <span className="material-symbols-sharp">menu</span>
      </button>
    </div>
  );
};

export default Header;
