import { useEffect, useState } from "react";
import { getEntities } from "../services/entityService";

function EntitySelector({ value, onChange }) {
  const [entities, setEntities] = useState([]);
  const [inputValue, setInputValue] = useState(value || "");

  const fetchEntities = async (searchTerm = "") => {
    try {
      const res = await getEntities(searchTerm);
      setEntities(res.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch entities:", error);
    }
  };

  useEffect(() => {
    fetchEntities();
  }, []);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  // Debounce entity search when typing
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchEntities(inputValue);
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [inputValue]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    // On blur, check if inputValue matches an entity name
    const selected = entities.find((entity) => entity.name === inputValue);
    if (selected) {
      onChange(selected.name);
    } else {
      onChange(""); // Or null, to clear
      setInputValue(""); // Optionally clear input if no match
    }
  };

  return (
    <>
      <input
        list="entity-options"
        className="form-control"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        placeholder="Choisir une entité..."
        autoComplete="off"
      />
      <datalist id="entity-options">
        {entities.map((entity) => (
          <option key={entity.id} value={entity.name} />
        ))}
      </datalist>
    </>
  );
}

export default EntitySelector;
