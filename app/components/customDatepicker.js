export default function CustomDatepicker({selectedDate, onSelected}) {
  let now = new Date();
  let end;

  if ( now.getHours() >= 19 ) {
    // dopo le 20:00 di oggi disattivare 1 settimana fa e attivare oggi
    end = new Date().toLocaleDateString('en-CA')
  }
  else {
    // oggi prima delle 20:00 -> mostrare 1 sett fa non oggi
    now.setDate(now.getDate()-1)
    end = new Date(now.getTime()).toLocaleDateString('en-CA')
  }

  return (
    <form className="row g-3">
      <div className="col">
        <label htmlFor="datePicker1" className="form-label">Seleziona data</label>
        <input 
        type="date" 
        className={"form-control"} 
        id="date"
        value={new Date(selectedDate).toLocaleDateString('en-CA')} 
        min={'2022-10-31'} 
        max={end} 
        onChange={((e)=>{onSelected(e.target.valueAsNumber)})}
        />
      </div>
    </form>
  )
}