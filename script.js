
// 54 HS UH-1N MQF Quiz — Embedded Build

/* === Mobile Compatibility Polyfills === */
(function(){
  // Set polyfill (very tiny, only if missing)
  if (typeof Set === 'undefined') {
    function SimpleSet(){ this._ = {}; }
    SimpleSet.prototype.has = function(v){ return this._.hasOwnProperty(v); };
    SimpleSet.prototype.add = function(v){ this._[v] = true; return this; };
    SimpleSet.prototype.delete = function(v){ delete this._[v]; };
    SimpleSet.prototype.values = function(){ return Object.keys(this._); };
    window.Set = SimpleSet;
  }
  if (!Array.prototype.find){
    Array.prototype.find = function(predicate, thisArg){
      for (var i=0;i<this.length;i++){ if (predicate.call(thisArg, this[i], i, this)) return this[i]; }
      return undefined;
    };
  }
  if (!Array.prototype.includes){
    Array.prototype.includes = function(val){
      for (var i=0;i<this.length;i++){ if (this[i]===val) return true; } return false;
    };
  }
  if (typeof Object.assign !== 'function'){
    Object.assign = function(target){
      if (target == null) throw new TypeError('Cannot convert undefined or null to object');
      target = Object(target);
      for (var i=1;i<arguments.length;i++){
        var src = arguments[i];
        if (src != null){
          for (var key in src){ if (Object.prototype.hasOwnProperty.call(src, key)) target[key] = src[key]; }
        }
      }
      return target;
    };
  }
})();

function addTap(el, handler){
  if (!el) return;
  el.addEventListener('click', handler, false);
  el.addEventListener('touchend', function(e){
    try{ e.preventDefault(); }catch(_){}
    handler(e);
  }, false);
}

// Features: Quiz, Exam, Flashcards (SR), Seeded Shuffle, Favorites Only, Notes, Analytics-lite

const STORE={settings:'mqf54hs-settings',srDeck:'mqf54hs-srdeck',notes:'mqf54hs-notes',marks:'mqf54hs-bookmarks',history:'mqf54hs-history',qStats:'mqf54hs-qstats'};

const questions = [{"qNum": 1, "q": "Operating procedures, techniques, etc., which will result in personal injury or loss of life if not carefully followed.", "options": ["Warning", "Caution", "Note", "Shall or Will"], "correct": "Warning", "ref": "TO 1H-1(U)N-1 Pg: xxii"}, {"qNum": 2, "q": "Operating procedures, techniques, etc., which will result in damage to equipment if not carefully followed.", "options": ["Warning", "Caution", "Note", "Should"], "correct": "Caution", "ref": "TO 1H-1(U)N-1 Pg: xxii"}, {"qNum": 3, "q": "An operating procedure, technique, etc., which is considered essential to emphasize.", "options": ["Warning", "Caution", "Note", "May"], "correct": "Note", "ref": "TO 1H-1(U)N-1 Pg: xxiii"}, {"qNum": 4, "q": "Used only when application of a procedure is mandatory.", "options": ["Shall or Will", "Should", "May", "Warning"], "correct": "Shall or Will", "ref": "TO 1H-1(U)N-1 Pg: xxiii"}, {"qNum": 5, "q": "Used only when application of a procedure is recommended.", "options": ["Shall or Will", "Should", "May", "Caution"], "correct": "Should", "ref": "TO 1H-1(U)N-1 Pg: xxiii"}, {"qNum": 6, "q": "Used to indicate an acceptable or suggested means of accomplishment.", "options": ["Shall or Will", "Should", "May", "Note"], "correct": "May", "ref": "TO 1H-1(U)N-1 Pg: xxiii"}, {"qNum": 7, "q": "(Engine Fuel Control Units) When operating in AUTO, it is possible to exceed maximum _____.", "options": ["Ng and Nf only.", "Q only.", "ITT only.", "Ng, Nf, Q, and ITT"], "correct": "Ng, Nf, Q, and ITT", "ref": "TO 1H-1(U)N-1 Pg: 1-14"}, {"qNum": 8, "q": "(Engine Fuel Control Units) When operating in MANUAL, it is possible to overspeed the _________, and to exceed ______.", "options": ["Ng turbine and Nf turbine,", "Ng turbine and Nf turbine, Q", "Ng turbine, ITT", "Ng turbine and Nf turbine, ITT or Q"], "correct": "Ng turbine and Nf turbine, ITT or Q", "ref": "TO 1H-1(U)N-1 Pg: 1-14"}, {"qNum": 9, "q": "(Droop Compensator) When the rivet is sheared, the droop compensator is inoperative. The Nf governors will still control Nf RPM, but transient droop/overspeed and recovery time will increase. Collective adjustments should be ______ to prevent rotor decay or overspeeds.", "options": ["increased", "slow", "rapid", "precise"], "correct": "slow", "ref": "TO 1H-1(U)N-1 Pg: 1-14"}, {"qNum": 10, "q": "(Governor Switch) It is possible to have a GOV MANUAL light and still be in the automatic mode if a malfunction exists in the ________.", "options": ["fuel control valve", "solenoid", "wiring", "all of the above"], "correct": "all of the above", "ref": "TO 1H-1(U)N-1 Pg: 1-22"}, {"qNum": 11, "q": "(Pilot Override Switch) With the pilot override switch in the ____ position, it is possible to engage both starters simultaneously. This should not be attempted as an extreme voltage drain will occur possibly causing destruction of the aircraft battery.", "options": ["OFF", "ON", "AUTO", "START"], "correct": "OFF", "ref": "TO 1H-1(U)N-1 Pg: 1-22"}, {"qNum": 12, "q": "(Rotor System) If _____ TEMP-PLATES are defective then a potential over-temp condition needs to be investigated. Do not fly and make an entry in the AFTO 781A.", "options": ["one", "both", "right", "left"], "correct": "both", "ref": "TO 1H-1(U)N-1 Pg: 1-45"}, {"qNum": 13, "q": "(Collective Pitch Control Lever) The collective has a built in friction which requires a force to move the stick up from the neutral (center of travel) position of _____ to _____ pounds with boost ON.", "options": ["2, 4", "5, 10", "8, 10", "11, 14"], "correct": "8, 10", "ref": "TO 1H-1(U)N-1 Pg: 1-47"}, {"qNum": 14, "q": "(Fuel System Caution Panel) Do not press and hold the ________ switch.", "options": ["DAY LT BRT/DIM", "BIT", "ZERO CAL", "LAMP TEST"], "correct": "ZERO CAL", "ref": "TO 1H-1(U)N-1 Pg: 1-53"}, {"qNum": 15, "q": "(RPM Warning System) The RPM warning light on the instrument panel illuminates whenever Nr drops below _____% ±2 or exceeds _____% ±2. Also, when either engine Ng speed drops below _____% ±2.", "options": ["92, 103, 52", "103, 92, 52", "52, 92, 103", "52, 103, 92"], "correct": "92, 103, 52", "ref": "TO 1H-1(U)N-1 Pg: 1-90"}, {"qNum": 16, "q": "(Wire Strike Protection System) During takeoff and at any time the helicopter skids are close to the ground (nose low at _____° or more) can result in ground contact of the WSPS lower cutter tip.", "options": ["7", "8", "10", "12"], "correct": "10", "ref": "TO 1H-1(U)N-1 Pg: 1-93"}, {"qNum": 17, "q": "(Exterior Inspection) Accumulation of __________ will be removed prior to flight. Failure to do so can result in hazardous flight, due to aerodynamic and center of gravity disturbances.", "options": ["snow and ice", "dirt and grass", "static electricity", "water"], "correct": "snow and ice", "ref": "TO 1H-1(U)N-1 Pg: 2-5"}, {"qNum": 18, "q": "(Exterior Inspection) The rotor blade skin will be inspected for __________. All suspected damage will be inspected by maintenance personnel to determine the extent of damage.", "options": ["dents", "creases and skin delamination", "corrosion", "all of the above"], "correct": "all of the above", "ref": "TO 1H-1(U)N-1 Pg: 2-5"}, {"qNum": 19, "q": "(Interior Inspection and Before Start) When moving the collective without hydraulic assist, grip the collective __________ to avoid stress in the area between the throttles.", "options": ["at the collective switch box", "at the number one throttle", "at the number two throttle", "at the throttles"], "correct": "at the throttles", "ref": "TO 1H-1(U)N-1 Pg: 2-10"}, {"qNum": 20, "q": "(Interior Inspection and Before Start) Battery starts with static voltage below _____ volts may result in a hot start. Battery starts should not be attempted with voltage below _____ volts.", "options": ["20, 20", "20, 23.5", "23.5, 20", "23.5, 23.5"], "correct": "23.5, 20", "ref": "TO 1H-1(U)N-1 Pg: 2-12"}, {"qNum": 21, "q": "(Interior Inspection and Before Start) If external power voltage exceeds _____ volts turn off external power immediately, adjust the APU to provide lower voltage. Damage to the aircraft electrical system could occur at voltages above _____ volts.", "options": ["29.5, 29.5", "23.5, 23.5", "20, 20", "None of the Above"], "correct": "29.5, 29.5", "ref": "TO 1H-1(U)N-1 Pg: 2-12"}, {"qNum": 22, "q": "(Starting Engines) To preclude possible hearing loss, ensure all personnel within _____ feet of the aircraft wear hearing protection.", "options": ["20", "30", "10", "45"], "correct": "30", "ref": "TO 1H-1(U)N-1 Pg: 2-14"}, {"qNum": 23, "q": "(Starting Engines) If ITT exceeds _____° C, move the throttle to OFF.", "options": ["770", "810", "870", "1090"], "correct": "1090", "ref": "TO 1H-1(U)N-1 Pg: 2-15"}, {"qNum": 24, "q": "(Starting Engines) ITT above _____° C shall be monitored during start and if time exceeds limits shown in Figure 5-1 (Engine Overtemperature - Starting), a hot start has occurred.", "options": ["770", "810", "870", "1090"], "correct": "870", "ref": "TO 1H-1(U)N-1 Pg: 2-15"}, {"qNum": 25, "q": "(Starting Engines) For a hot start or impending overtemp, continue to motor the engine until________. If any limits are exceeded, annotate in the AFTO 781A.", "options": ["30 seconds have passed", "ITT decreases to within normal operating limits", "ITT decreases to within caution range of operating limits", "15 seconds have passed"], "correct": "ITT decreases to within normal operating limits", "ref": "TO 1H-1(U)N-1 Pg: 2-15"}, {"qNum": 26, "q": "(Starting Engines) During cold weather start it is permissible for oil pressure to reach _____ PSI maximum transient during throttle sequence for _____ seconds.", "options": ["150, 10", "150, 30", "112, 10", "112, 30"], "correct": "150, 10", "ref": "TO 1H-1(U)N-1 Pg: 2-15"}, {"qNum": 27, "q": "(Starting Engines) The start must be terminated if ITT fails to rise within _____ seconds after opening the throttle.", "options": ["5", "15", "20", "30"], "correct": "15", "ref": "TO 1H-1(U)N-1 Pg: 2-15"}, {"qNum": 28, "q": "(Before Taxi) Pull pedestal cooling control knob out when temperature is at or above _____ °C. If the OAT is more than _____ ° C, the vent blower should also be turned on. At least one of the two intake control valves must be open in order for cool air to reach the center pedestal.", "options": ["5, 10", "10, 5", "19, 29", "29, 19"], "correct": "19, 29", "ref": "TO 1H-1(U)N-1 Pg: 2-22"}, {"qNum": 29, "q": "(Taxi) Cockpit readings that do not agree with the computed torque readings (from Appendix A), but do not exceed plus _____% of computed values, may be considered acceptable. If cockpit torque readings differ from computed values by more than plus _____% for a five foot hover, check cockpit versus computed power for OGE hover. If the two agree within plus _____%, the aircraft may be flown provided OGE power is used for mission planning.", "options": ["2", "4", "20", "None of the Above"], "correct": "4", "ref": "TO 1H-1(U)N-1 Pg: 2-25"}, {"qNum": 30, "q": "(Takeoff) The airspeed, vertical velocity and altimeter are unreliable below _____ because of the rotor downwash on the pitot static system. During takeoff, do not rely on these instruments until at least _____.", "options": ["IGE", "ETL", "OGE", "30 KIAS"], "correct": "30 KIAS", "ref": "TO 1H-1(U)N-1 Pg: 2-26"}, {"qNum": 31, "q": "(Takeoff) If the aircraft cannot be stabilized at _________ hover without RPM bleed off, it is overloaded for the current conditions. Cargo and/or passengers should be off loaded until RPM remains normal. If the wind is at or above ETL, the operational value of the slide takeoff has been practically eliminated.", "options": ["a two foot", "a four foot", "an OGE", "None of the Above"], "correct": "a two foot", "ref": "TO 1H-1(U)N-1 Pg: 2-27"}, {"qNum": 32, "q": "(After Landing) Maintain flight idle _____ minute prior to closing throttles to stabilize engine temperatures.", "options": ["one", "two", "five", "fifteen"], "correct": "one", "ref": "TO 1H-1(U)N-1 Pg: 2-33"}, {"qNum": 33, "q": "(Emergency Procedures) The nature and environment of the emergency dictate that a landing be made without delay to assure survival of the occupants.", "options": ["Land Immediately", "Land As Soon As Possible", "Land As Soon As Practical", "None of the above"], "correct": "Land Immediately", "ref": "TO 1H-1(U)N-1 Pg: 3-3"}, {"qNum": 34, "q": "(Emergency Procedures) The nature and environment of the emergency dictate that a landing be made at the first available area which will assure minimum injury to crew or minimum damage to the aircraft.", "options": ["Land Immediately", "Land As Soon As Possible", "Land As Soon As Practical", "None of the above"], "correct": "Land As Soon As Possible", "ref": "TO 1H-1(U)N-1 Pg: 3-3"}, {"qNum": 35, "q": "(Emergency Procedures) The nature and environment of the emergency dictate that a landing be made at the first available area or landing site which will assure no injury to the crew or damage to the aircraft and provides acceptable access for corrective action.", "options": ["Land Immediately", "Land As Soon As Possible", "Land As Soon As Practical", "None of the above"], "correct": "Land As Soon As Practical", "ref": "TO 1H-1(U)N-1 Pg: 3-3"}, {"qNum": 36, "q": "(Emergency Shutdown Procedures) Applying the rotor brake above _____% Nr will increase the tendency for the aircraft to spin on smooth surfaces.", "options": ["10", "20", "30", "40"], "correct": "40", "ref": "TO 1H-1(U)N-1 Pg: 3-5"}, {"qNum": 37, "q": "(Engine Fire on the Ground) If a fire pull handle was previously pulled, reset the handle prior to actuating the __________ switch.", "options": ["PART SEP", "INVERTER", "FIRE EXT", "BATTERY"], "correct": "FIRE EXT", "ref": "TO 1H-1(U)N-1 Pg: 3-6"}, {"qNum": 38, "q": "(Lightning Strikes) When lightning is encountered at night, the interior and instrument lights should be turned to _____ intensity to preclude temporary blindness.", "options": ["full", "medium", "low", "none of the above"], "correct": "full", "ref": "TO 1H-1(U)N-1 Pg: 3-7"}, {"qNum": 39, "q": "(Main Rotor Malfunctions) The severity of the malfunction and the risk associated with continued flight may require the pilot to __________.", "options": ["land as soon as practical", "land as soon as possible", "land immediately", "return to base"], "correct": "land immediately", "ref": "TO 1H-1(U)N-1 Pg: 3-8"}, {"qNum": 40, "q": "(Loss of Pitch Control to One Blade) If loss of pitch control to one blade occurs: __________.", "options": ["return to base", "land as soon as practical", "land as soon as possible", "land immediately"], "correct": "land immediately", "ref": "TO 1H-1(U)N-1 Pg: 3-8"}, {"qNum": 41, "q": "(Complete Loss of Tail Rotor Thrust) Tail rotor failure can put the aircraft in such an attitude with respect to the rotor disk and the natural horizon, that the pilot naturally tends toward _____ cyclic to correct the attitude. These cyclic inputs combined with aircraft attitude can exceed the 11° flapping angle and induce mast bumping.", "options": ["left forward", "right rear", "right forward", "left rear"], "correct": "right rear", "ref": "TO 1H-1(U)N-1 Pg: 3-9"}, {"qNum": 42, "q": "(Complete Loss of Tail Rotor Thrust (Uncontrollable) ) At airspeeds below _____ knots, controllability is doubtful and entering autorotation is the only means to recover the aircraft. In a hover, immediately retard throttles to flight idle, maintain level attitude and make an autorotational landing.", "options": ["30", "40", "50", "60"], "correct": "60", "ref": "TO 1H-1(U)N-1 Pg: 3-9"}, {"qNum": 43, "q": "(Complete Loss of Tail Rotor Thrust (Uncontrollable) ) The inadvertent application of power at touchdown could have catastrophic results. PRIOR TO THE _____, ROTATE THROTTLES OFF. This will eliminate the possibility of inadvertent throttle input prior to touchdown.", "options": ["FLARE", "GO-AROUND", "POWER RECOVERY", "LANDING"], "correct": "FLARE", "ref": "TO 1H-1(U)N-1 Pg: 3-10"}, {"qNum": 44, "q": "(Complete Loss of Tail Rotor Thrust (Uncontrollable) ) Failure to maintain 60 knots until touchdown may result in an ________ and unrecoverable spin to the ____.", "options": ["controllable, left", "uncontrollable, right", "controllable, right", "uncontrollable, left"], "correct": "uncontrollable, right", "ref": "TO 1H-1(U)N-1 Pg: 3-10"}, {"qNum": 45, "q": "(Engine Failure) During cruise, the _______________ could fail without recognition unless either a higher power setting is used or a single engine failure should occur.", "options": ["engine driven fuel pump", "automatic fuel control", "integrated valve and filter assembly", "none of the above"], "correct": "automatic fuel control", "ref": "TO 1H-1(U)N-1 Pg: 3-13"}, {"qNum": 46, "q": "(Single Engine Failure Inflight) Prior to beginning the approach ensure power available is sufficient for the desired approach and possible _____.", "options": ["flare", "power recovery", "go-around", "landing"], "correct": "go-around", "ref": "TO 1H-1(U)N-1 Pg: 3-14"}, {"qNum": 47, "q": "(Engine Oil System Malfunctions) Monitor the affected engine instruments and upon any indication of impending engine failure, refer to ____________________.", "options": ["DUAL ENGINE FAILURE", "ENGINE RESTART INFLIGHT (Automatic Start)", "ENGINE RESTART INFLIGHT (Manual Start)", "ENGINE SHUTDOWN INFLIGHT"], "correct": "ENGINE SHUTDOWN INFLIGHT", "ref": "TO 1H-1(U)N-1 Pg: 3-15"}, {"qNum": 48, "q": "(Engine Shutdown Inflight) Ensure that the __________ caution light illuminates during shutdown. Failure of the particle separator door to close could prevent normal engine cool down and fuel/fume elimination. It may be necessary to position the particle separator switch to OFF to ensure door closure.", "options": ["HYD SYS", "OIL PRESSURE", "AC FAIL", "PART SEP OFF"], "correct": "PART SEP OFF", "ref": "TO 1H-1(U)N-1 Pg: 3-16"}, {"qNum": 49, "q": "(Engine Restart Inflight) A failed engine should not be started inflight unless it can be determined that it is reasonably safe to do so. Before restarting engine inflight allow _____ seconds of gas generator coast down with throttle in the OFF position to purge the engine of fumes and fuel.", "options": ["0", "15", "30", "60"], "correct": "30", "ref": "TO 1H-1(U)N-1 Pg: 3-16"}, {"qNum": 50, "q": "(Engine Restart Inflight (Automatic/Manual Start) ) A relight should be obtained within 15 seconds and will be evidenced by a rise in _____ and _____.", "options": ["Ng, ITT", "Ng, fuel flow", "ITT, fuel flow", "fuel flow, amperage"], "correct": "Ng, ITT", "ref": "TO 1H-1(U)N-1 Pg: 3-16"}, {"qNum": 51, "q": "(Dual Engine Failure) Nr can only be regained by lowering the collective and reducing the drag effect of the main rotor. Should the lowering of the collective be delayed and Nr decays below _____%, the main rotor blades will stall and Nr can never be regained.", "options": ["88", "83", "78", "71"], "correct": "78", "ref": "TO 1H-1(U)N-1 Pg: 3-18"}, {"qNum": 52, "q": "(Dual Engine Failure) Abrupt lowering of the collective and simultaneous forward movement of the cyclic during flight at high power can result in ____________________.", "options": ["a zero or negative \"G\" maneuver", "mast bumping", "loss of aircraft control", "all of the above"], "correct": "all of the above", "ref": "TO 1H-1(U)N-1 Pg: 3-18"}, {"qNum": 53, "q": "(Dual Engine Failure) One of the most common errors is that of landing in a _____ attitude. This often results in such rapid \"nose down\" pitching that the main rotor strikes the tail boom. To avoid tail boom strikes by the main rotor, aft cyclic should not be applied after ground contact is made. Regardless of the force with which the helicopter strikes the ground, damage will be much less if it strikes level.", "options": ["\"tail high\"", "\"tail low\"", "\"positive\"", "\"negative\""], "correct": "\"tail low\"", "ref": "TO 1H-1(U)N-1 Pg: 3-19"}, {"qNum": 54, "q": "(Engine Fire Inflight) Do not pull the fire handle with the fire extinguisher switch in any position but _____.", "options": ["MAIN", "RESERVE", "ON", "OFF"], "correct": "OFF", "ref": "TO 1H-1(U)N-1 Pg: 3-24"}, {"qNum": 55, "q": "(Smoke and Fume Elimination) All unidentifiable odors shall be considered toxic. If airborne, _______________. Do not resume flight until source of odor is identified.", "options": ["return to base", "land as soon as practical", "land as soon as possible", "land immediately"], "correct": "land as soon as practical", "ref": "TO 1H-1(U)N-1 Pg: 3-25"}, {"qNum": 56, "q": "(Fuel Control System Actuation) Confirm shift of fuel control by observing changes or fluctuations in __________.", "options": ["Ng", "ITT", "fuel flow", "All of the Above"], "correct": "All of the Above", "ref": "TO 1H-1(U)N-1 Pg: 3-28"}, {"qNum": 57, "q": "(Fuel Control System Actuation) During an engine compressor stall, the possibility exists that extreme temperatures caused by a rapidly rising _____ may cause engine turbine blade damage resulting in engine failure. Additionally during compressor stalls, manually increasing fuel flow to correct for a low power condition may compound the _____ over temp condition.", "options": ["Ng", "ITT", "Nf", "Nr"], "correct": "ITT", "ref": "TO 1H-1(U)N-1 Pg: 3-28"}, {"qNum": 58, "q": "(Main Driveshaft Failure) Rotor control is critical during MAIN DRIVE SHAFT FAILURE. _____ will immediately and rapidly decay, jeopardizing your ability to autorotate. It is imperative to react instantly and lower the collective to maintain _____. You must also be conscious of possibly inducing negative Gs/mast bumping with rapid collective reduction. (Refer to Main Rotor RPM Decay Rate, Figure 3-2).", "options": ["Ng", "ITT", "Nf", "Nr"], "correct": "Nr", "ref": "TO 1H-1(U)N-1 Pg: 3-30"}, {"qNum": 59, "q": "(Main Driveshaft Failure) Due to the violent nature of this failure you can expect multiple emergencies to occur. Uncontrolled overspeeding _____ may result in explosive engine failures. Collateral damage to other components, including flight controls, can occur. No set procedure can be developed for compounding emergencies but in all cases, rotor control is critical.", "options": ["Ngs", "ITTs", "Nfs", "Nr"], "correct": "Nfs", "ref": "TO 1H-1(U)N-1 Pg: 3-30"}, {"qNum": 60, "q": "(Electrical Power System Malfunction) _____ use a circuit breaker as a switch. Circuit breakers are to be pulled only when necessary to isolate a system during an emergency or for maintenance.", "options": ["Sometimes", "Always", "Never", "None of the Above"], "correct": "Never", "ref": "TO 1H-1(U)N-1 Pg: 3-32"}, {"qNum": 61, "q": "(DC Generator Failure) If equipment powered by the __________ Bus is required, the Non-Essential Bus switch must be in the MANUAL position.", "options": ["NON ESS", "ESS", "MAIN", "BATTERY"], "correct": "NON ESS", "ref": "TO 1H-1(U)N-1 Pg: 3-32"}, {"qNum": 62, "q": "(Hydraulic System Failure) There is a possibility that a partial or total loss of hydraulic power could be the result of an electrical short circuit to the solenoid operated shut-off valve. Pulling the _________ circuit breaker out may restore hydraulic power. If this procedure does not restore power, then the circuit breaker must be reset to restore the function of the Hydraulic Control Master Switch.", "options": ["HYD CONT", "MAIN INVTR", "STBY INVTR", "IDLE STOP"], "correct": "HYD CONT", "ref": "TO 1H-1(U)N-1 Pg: 3-35"}, {"qNum": 63, "q": "(Crew and Passenger Briefing Guides) In typical configuration, the UH-1N has ___ fire extinguishers and ____ first aid kits.", "options": ["2, 4", "4, 2", "3, 6", "1, 6"], "correct": "2, 4", "ref": "TO 1H-1(U)N-1 Pg: 4-46"}, {"qNum": 64, "q": "(Instrument Markings) _____ markings indicate the limit above or below which continued operation will cause damage or shorten component life.", "options": ["Green", "Yellow", "Red", "None of the above"], "correct": "Red", "ref": "TO 1H-1(U)N-1 Pg: 5-1"}, {"qNum": 65, "q": "(Instrument Markings) _____ markings indicate a safe or normal range of operation.", "options": ["Green", "Yellow", "Red", "None of the above"], "correct": "Green", "ref": "TO 1H-1(U)N-1 Pg: 5-1"}, {"qNum": 66, "q": "(Instrument Markings) Flight with indications in the yellow range is __________.", "options": ["not recommended", "acceptable", "permissible for 5 minutes", "none of the above"], "correct": "not recommended", "ref": "TO 1H-1(U)N-1 Pg: 5-1"}, {"qNum": 67, "q": "(Engine Limits) Duration of single engine operation above _____% Q must be entered in AFTO 781A.", "options": ["88", "83", "78", "71"], "correct": "78", "ref": "TO 1H-1(U)N-1 Pg: 5-2"}, {"qNum": 68, "q": "(ITT Fluctuation Limitations) Allowable ITT fluctuation is ±_____°C, provided fluctuations are not rapid or erratic.", "options": ["7", "5", "4", "2"], "correct": "5", "ref": "TO 1H-1(U)N-1 Pg: 5-2"}, {"qNum": 69, "q": "(Transmission Limitations) Operation equal to or greater than _____% torque is limited to 5 minutes.", "options": ["88", "83", "78", "71"], "correct": "88", "ref": "TO 1H-1(U)N-1 Pg: 5-3"}, {"qNum": 70, "q": "(Transmission Limitations) Transient fluctuations up to ±_____ PSI within the normal operating range are permissible provided the oil temperature remains normal.", "options": ["2", "4", "5", "7"], "correct": "7", "ref": "TO 1H-1(U)N-1 Pg: 5-3"}, {"qNum": 71, "q": "(Torque Splits) The maximum allowable steady state torque split between the number one and number two engine is _____%. Transient torque splits during power changes are not abnormal as long as torque needles remarry within 20 seconds.", "options": ["2", "4", "5", "7"], "correct": "4", "ref": "TO 1H-1(U)N-1 Pg: 5-3"}, {"qNum": 72, "q": "(CGB Oil Pressure Fluctuation Limitations) Allowable combining gear box oil pressure fluctuations are ±_____ PSI within the normal operating range of __________ PSI. This fluctuation is acceptable if it occurs at mean indications of 60 or 85 PSI such that readings of 55 to 65 or 80 to 90 PSI are experienced.", "options": ["5, 40 to 60", "7, 40 to 60", "5, 60 to 85", "7, 60 to 85"], "correct": "5, 60 to 85", "ref": "TO 1H-1(U)N-1 Pg: 5-3"}, {"qNum": 73, "q": "(Engine Oil Pressure Fluctuation Limitations) Allowable oil pressure fluctuation is ±_____ PSI, within the normal operating range of __________ PSI.", "options": ["7, 40 to 80", "7, 80 to 112", "5, 40 to 80", "5, 80 to 112"], "correct": "5, 80 to 112", "ref": "TO 1H-1(U)N-1 Pg: 5-3"}, {"qNum": 74, "q": "(Airspeed Limitations) The maximum permissible airspeed is _____ KIAS. The maximum airspeed with an extended load on the rescue hoist is _____ KIAS.", "options": ["120, 55", "120, 30", "130, 55", "130, 30"], "correct": "130, 30", "ref": "TO 1H-1(U)N-1 Pg: 5-3"}, {"qNum": 75, "q": "(Engine Oil Temperature and Pressure) At _____% engine torque or greater and with 100% Nr, minimum engine oil pressure is ____ PSI.", "options": ["5, 40", "5, 80", "15, 40", "15, 80"], "correct": "15, 80", "ref": "TO 1H-1(U)N-1 Pg: 5-6"}, {"qNum": 76, "q": "(Sideward and Rearward Airspeeds) Sideward airspeed is limited to a maximum of _____ knots, including wind factor. Sideward is the 90°quadrant on either side of the aircraft, from 45° off the nose to 45° off the tail.", "options": ["30", "35", "80", "120"], "correct": "35", "ref": "TO 1H-1(U)N-1 Pg: 5-3"}, {"qNum": 77, "q": "(Sideward and Rearward Airspeeds) Rearward airspeed is limited to a maximum of _____ knots including wind factor. Rearward is the 90° quadrant 45° on either side of the tail.", "options": ["30", "35", "80", "120"], "correct": "30", "ref": "TO 1H-1(U)N-1 Pg: 5-3"}, {"qNum": 78, "q": "(Cargo Door Airspeed Limits) The maximum airspeed with the cargo doors partially open (unsecured) or to open and close doors inflight is _____ KIAS.", "options": ["55", "80", "120", "130"], "correct": "80", "ref": "TO 1H-1(U)N-1 Pg: 5-3"}, {"qNum": 79, "q": "(Cargo Door Airspeed Limits) Maximum airspeed with cargo doors fully opened and secured is _____ KIAS.", "options": ["55", "80", "120", "130"], "correct": "120", "ref": "TO 1H-1(U)N-1 Pg: 5-3"}, {"qNum": 80, "q": "(Autorotations) Under all circumstances, autorotational landings should be attempted into the wind. The maximum steady state autorotation airspeed is _____ KIAS.", "options": ["60", "100", "110", "130"], "correct": "110", "ref": "TO 1H-1(U)N-1 Pg: 5-3"}, {"qNum": 81, "q": "(Center of Gravity Limitations) The lateral center of gravity limits are _____ inches left or right of the longitudinal axis.", "options": ["6", "2", "1", "0"], "correct": "6", "ref": "TO 1H-1(U)N-1 Pg: 5-9"}, {"qNum": 82, "q": "(Gross Weight Limits) The maximum takeoff gross weight of the helicopter is _____ pounds. The maximum ramp gross weight of the helicopter is _____ pounds. Aircraft are restricted from any ground handling, taxi, or takeoff operations above _____ pounds.", "options": ["10500, 11000, 10500", "10500, 10500, 10500", "11000, 11000, 11000", "11000, 15000, 11000"], "correct": "10500, 11000, 10500", "ref": "TO 1H-1(U)N-1 Pg: 5-9"}, {"qNum": 83, "q": "(Gross Weight Limits) National Emergency/Nuclear Weapons Security Contingency operations may require flight operations in excess of 10,500 pounds. In this event, gross weights up to 11,000 pounds are authorized, subject to the following warning(s):", "options": ["Single Engine Capability may be marginal or non-existent at higher density altitudes.", "Safe autorotation capability may not be available, especially at higher density altitudes.", "Aircraft performance and handling qualities may be significantly degraded.", "All of the above"], "correct": "All of the above", "ref": "TO 1H-1(U)N-1 Pg: 5-9"}, {"qNum": 84, "q": "(Flight Restrictions) All operations above 10,500 pounds are increased risk missions and must be kept to an absolute minimum. No flight above 10,500 pounds should ever be construed as a routine or normal operation. The following restriction(s) apply to flights above 10,500 pounds:", "options": ["CG limits are 134-139.", "Rotor speed should be maintained at 100 percent.", "Takeoff, landing and In-Ground-Effect (IGE) maneuvering is limited to current flight manual parameters.", "All of the above"], "correct": "All of the above", "ref": "TO 1H-1(U)N-1 Pg: 5-9"}, {"qNum": 85, "q": "(Wind Limitations) Starting and stopping rotors with surface winds above _____ knots is prohibited.", "options": ["45", "40", "20", "15"], "correct": "45", "ref": "TO 1H-1(U)N-1 Pg: 5-12"}, {"qNum": 86, "q": "(Extreme Temperature Operation) Operation in ambient temperatures above _____° C and below _____° C is prohibited.", "options": ["52, 54", "54, 52", "52, -54", "54, -52"], "correct": "52, -54", "ref": "TO 1H-1(U)N-1 Pg: 5-12"}, {"qNum": 87, "q": "(Maximum Altitude Operation) The maximum operational altitude is 15,000 feet pressure and/or density altitudes. For gross weights above 10,000 pounds, the maximum operational altitude is _____ feet pressure and/ or density altitude.", "options": ["6600", "8000", "10000", "15000"], "correct": "10000", "ref": "TO 1H-1(U)N-1 Pg: 5-12"}, {"qNum": 88, "q": "(Vortex Ring State) Increasing collective has no effect on recovery and will aggravate vortex ring state. During approaches at less than _____ knots, do not exceed _____ feet per minute descent rate.", "options": ["55, 800", "40, 800", "800, 40", "800, 55"], "correct": "40, 800", "ref": "TO 1H-1(U)N-1 Pg: 6-9"}, {"qNum": 89, "q": "(Settling With Power) Avoid rates of descent in excess of _____ feet per minute with airspeed below _____ knots.", "options": ["55, 800", "40, 800", "800, 40", "800, 55"], "correct": "800, 40", "ref": "TO 1H-1(U)N-1 Pg: 6-10"}, {"qNum": 90, "q": "(Settling With Power) When landing ______, the aircraft skids are designed to absorb a majority of the impact. Landing _____ will increase aircrew survivability and decrease overall damage to the aircraft.", "options": ["nose low", "level", "nose high", "straight ahead"], "correct": "level", "ref": "TO 1H-1(U)N-1 Pg: 6-10"}, {"qNum": 91, "q": "(Instrument Climb) Climbs with vertical velocities over _____ fpm are not recommended.", "options": ["100", "500", "1000", "1500"], "correct": "1500", "ref": "TO 1H-1(U)N-1 Pg: 7-2"}, {"qNum": 92, "q": "(Instrument Descent) Rates of descent over _____ fpm are not recommended.", "options": ["100", "500", "1000", "1500"], "correct": "1000", "ref": "TO 1H-1(U)N-1 Pg: 7-2"}, {"qNum": 93, "q": "(Rain) If the windshield wipers do not start in LOW or MED position, turn the control switch to _____. After the wiper starts, return the control switch to the desired position.", "options": ["PARK", "OFF", "MED", "HIGH"], "correct": "HIGH", "ref": "TO 1H-1(U)N-1 Pg: 7-3"}, {"qNum": 94, "q": "(Flight in Icing Conditions) Intentional flight through known icing conditions with OAT colder than _____° C is prohibited.", "options": ["- 10", "- 5", "5", "10"], "correct": "- 5", "ref": "TO 1H-1(U)N-1 Pg: 7-3"}, {"qNum": 95, "q": "(Flight in Icing Conditions) The particle separator should be in AUTO when visible moisture is evident at temperatures below _____° C.", "options": ["5", "10", "-5", "-10"], "correct": "5", "ref": "TO 1H-1(U)N-1 Pg: 7-3"}, {"qNum": 96, "q": "(Flight in Icing Conditions) Before entering possible icing conditions, (visible moisture with temperature below _____° C), the pilot should actuate the pitot heat.", "options": ["5", "10", "-5", "-10"], "correct": "10", "ref": "TO 1H-1(U)N-1 Pg: 7-3"}, {"qNum": 97, "q": "(Turbulence and Thunderstorm) Aircraft are restricted from flight in areas where turbulence is known to exceed _____.", "options": ["light", "moderate", "severe", "extreme"], "correct": "moderate", "ref": "TO 1H-1(U)N-1 Pg: 7-3"}, {"qNum": 98, "q": "(Wind Direction and Velocity) Depending on wind velocity, the apparent airspeed/ground speed relationship changes when turning downwind. After the turn, less airspeed is required to maintain ground speed. Reducing airspeed may result in loss of ETL which increases the power required to maintain altitude. When operating close to the surface, especially during downwind maneuvers, _____ and _____ required must be monitored closely.", "options": ["descent rate, torque", "airspeed, power", "Nfs, Nr", "CGB oil pressure, transmission oil pressure"], "correct": "airspeed, power", "ref": "TO 1H-1(U)N-1 Pg: 7-9"}, {"qNum": 99, "q": "(Cold Weather Operations) When the outside air temperature is below minus _____° C, do not advance throttles beyond _____% Ng until engine, combining gearbox, and transmission oil pressures are stabilized within desired operating range.", "options": ["18, 61", "18, 71", "10, 61", "10, 71"], "correct": "18, 71", "ref": "TO 1H-1(U)N-1 Pg: 7-15"}, {"qNum": 100, "q": "(Performance Data) All charts are presented for _____% Nf and Nr. It is strongly recommended that _____% RPM be used at 40 knots and below.", "options": ["100", "97", "91", "78"], "correct": "100", "ref": "TO 1H-1(U)N-1 Pg: A-1"}, {"qNum": 101, "q": "(Density Altitude) Humidity affects density altitude. The higher the humidity, the higher the density altitude. This in fact could have an effect on power required. Throughout this manual add _____ feet density altitude for each _____ percent increase in humidity above 40 percent.", "options": ["100, 10", "220, 10", "100, 5", "220, 5"], "correct": "100, 10", "ref": "TO 1H-1(U)N-1 Pg: A-8"}, {"qNum": 102, "q": "(Fuel Flow) Increase fuel flow _____% for heater on.", "options": ["2", "4", "10", "None of the above."], "correct": "2", "ref": "TO 1H-1(U)N-1 Pg: A-11"}, {"qNum": 103, "q": "(Tail Rotor Effectiveness) To ensure adequate tail rotor and cyclic control margins, avoid winds in excess of _____ knots from approximately the __________ o'clock position. Avoiding winds from these critical azimuths can help preclude loss of tail rotor effectiveness.", "options": ["10, 2 to 4", "10, 8 to 10", "20, 2 to 4", "20, 8 to 10"], "correct": "20, 2 to 4", "ref": "TO 1H-1(U)N-1 Pg: A-46"}, {"qNum": 104, "q": "(Sideward and Rearward Airspeed) With gross weights above 9,600 pounds and density altitudes above 10,000 feet, _______.", "options": ["Sideward and rearward flight is not recommended.", "Sufficient control authority may not be available to attain sideward and rearward flight velocities in excess of 15 knots", "Sideward and rearward flight may cause a vertical oscillation at approximately 3 cycles per second", "Adequate control margin exists at 25 knots sideward and 20 knots rearward."], "correct": "Sufficient control authority may not be available to attain sideward and rearward flight velocities in excess of 15 knots", "ref": "TO 1H-1(U)N-1 Pg: 5-3"}];

let active=[],current=0,answers=[],missed=[],testComplete=false,selectedOption=null,examMode=false;
let timerActive=false,remainingSeconds=0,timerId=null;
let flashMode=false,flashQueue=[],flashIndex=0,flashShowingBack=false;

const els = {
  shuffle:      byId("shuffle"),
  feedback:     byId("feedback"),
  qCount:       byId("questionCount"),
  start:        byId("startBtn"),
  startFlash:   byId("startFlashBtn"),
  reset:        byId("resetBtn"),
  quiz:         byId("quizContainer"),
  progressWrap: byId("progressWrap"),
  progressBar:  byId("progressBar"),
  timer:        byId("timer"),
  timerToggle:  byId("timerToggle"),
  timerMinutes: byId("timerMinutes"),
  timerMinutesWrap: byId("timerMinutesWrap"),
  themeBtn:     byId("themeBtn"),
  main:         byId("main"),
  examMode:     byId("examMode"),
  seedInput:    byId("seedInput"),
  analytics:    byId("analyticsContent"),
  favoritesOnly:byId("favoritesOnly")
};

document.addEventListener("DOMContentLoaded",()=>{
  hydrateSettings();
  wireEvents();
  updateTimerVisibility(els.timerToggle.checked);
  els.start.disabled=false;
  els.qCount.max=String(questions.length);
  if(+els.qCount.value>questions.length) els.qCount.value=questions.length;
  els.quiz.innerHTML = `<div class="panel review"><strong>${questions.length}</strong> questions ready. Choose settings, then click <em>Start Quiz</em> or <em>Start Flashcards</em>.</div>`;
  renderAnalytics();
});

function wireEvents(){
  els.start.addEventListener("click", function(){ startQuiz(); });
  els.startFlash.addEventListener("click", function(){ startFlashcards(); });
  els.reset.addEventListener("click", resetQuiz);
  els.timerToggle.addEventListener("change", e=>updateTimerVisibility(e.target.checked));
  els.themeBtn.addEventListener("click", function(){ toggleTheme(); });
  document.addEventListener("keydown", handleKeys, {passive:false});
}

function hydrateSettings(){
  try{
    const s=JSON.parse(localStorage.getItem(STORE.settings)||"{}");
    if(s){
      if(typeof s.shuffle==="boolean") els.shuffle.checked=s.shuffle;
      if(typeof s.feedback==="boolean") els.feedback.checked=s.feedback;
      if(typeof s.timerToggle==="boolean") els.timerToggle.checked=s.timerToggle;
      if(typeof s.examMode==="boolean") els.examMode.checked=s.examMode;
      if(s.qCount) els.qCount.value=+s.qCount;
      if(s.timerMinutes) els.timerMinutes.value=+s.timerMinutes;
      if(s.seed) els.seedInput.value=String(s.seed);
      if(s.theme==="dark") document.documentElement.classList.add("dark");
      els.themeBtn.textContent=document.documentElement.classList.contains("dark")?"☀️":"🌙";
      els.themeBtn.setAttribute("aria-pressed", String(document.documentElement.classList.contains("dark")));
    }
  }catch{}
}
function persistSettings(){
  const p={shuffle:els.shuffle.checked,feedback:els.feedback.checked,timerToggle:els.timerToggle.checked,qCount:+els.qCount.value||10,timerMinutes:+els.timerMinutes.value||20,examMode:!!els.examMode.checked,seed:els.seedInput.value,theme:document.documentElement.classList.contains("dark")?"dark":"light"};
  try{ localStorage.setItem(STORE.settings, JSON.stringify(p)); }catch(_e){}
}

function toggleTheme(){
  const dark=document.documentElement.classList.toggle("dark");
  els.themeBtn.setAttribute("aria-pressed", String(dark));
  els.themeBtn.textContent=dark?"☀️":"🌙";
  persistSettings();
}

function updateTimerVisibility(show){ els.timerMinutesWrap.hidden=!show; }
function startTimer(mins){
  stopTimer(); remainingSeconds=Math.max(1,(mins||20))*60; timerActive=true; tick(); timerId=setInterval(tick,1000);
  els.timer.textContent=formatTime(remainingSeconds);
}
function stopTimer(){ if(timerId){clearInterval(timerId); timerId=null;} timerActive=false; }
function tick(){
  els.timer.textContent=formatTime(remainingSeconds);
  if(remainingSeconds<=0){ stopTimer(); testComplete=true; renderQuiz(); return; }
  remainingSeconds--;
}
function formatTime(s){ const m=String(Math.floor(s/60)).padStart(2,"0"), r=String(Math.floor(s%60)).padStart(2,"0"); return `${m}:${r}`; }

function xmur3(str){let h=1779033703^str.length;for(let i=0;i<str.length;i++){h=Math.imul(h^str.charCodeAt(i),3432918353);h=h<<13|h>>>19;}return()=>{h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^h>>>16)>>>0;};}
function mulberry32(a){return function(){let t=a+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;};}
function seededShuffle(arr, seedStr){
  if(!seedStr) return arr.sort(()=>Math.random()-0.5);
  const seed=xmur3(seedStr)(); const rand=mulberry32(seed);
  const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(rand()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

function startQuiz(fromReview=false){
  if(!questions.length){ els.quiz.innerHTML='<div class="panel review">No questions loaded.</div>'; return; }
  examMode=!!els.examMode.checked; flashMode=false;
  if(examMode){ els.shuffle.checked=true; els.feedback.checked=false; els.timerToggle.checked=true; if(!+els.timerMinutes.value) els.timerMinutes.value=60; updateTimerVisibility(true); }
  persistSettings();

  const count=Math.max(1, Math.min(+els.qCount.value||questions.length, questions.length));
  let base = fromReview ? missed.slice() : questions.slice();
  if(els.favoritesOnly && els.favoritesOnly.checked){
    const favs=getBookmarks(); base = base.filter(q=>favs.has(q.qNum));
    if(!base.length){ els.quiz.innerHTML = '<div class="panel review">No favorites yet. Star some questions first.</div>'; return;}
  }
  let src = (els.shuffle.checked || examMode) ? seededShuffle(base, els.seedInput.value.trim()||null) : base;

  answers=[]; missed=[]; current=0; testComplete=false; selectedOption=null;
  active = src.slice(0, fromReview ? src.length : count);

  els.progressWrap.hidden=false;
  if(els.timerToggle.checked) startTimer(+els.timerMinutes.value || (examMode?60:20)); else { els.timer.textContent=""; stopTimer(); }

  renderQuiz(); els.main.focus();
}

function renderQuiz(){
  els.quiz.innerHTML="";
  if(testComplete){ stopTimer(); showDashboard(); return; }
  const item = active[current]; if(!item) return;
  const pct = Math.round((current/active.length)*100);
  els.progressBar.style.width = `${pct}%`; els.progressBar.setAttribute("aria-valuenow", String(pct));
  selectedOption = (answers[current] && answers[current].selected) || null;

  const card = el("article","question-card",{});
  card.appendChild(el("p","q-meta",{}, `Source Q${item.qNum} • Question ${current+1} of ${active.length} ${bookmarkStar(item.qNum)}`));
  card.appendChild(el("h3","q-text",{id:`q${item.qNum}`}, item.q));

  item.options.forEach((opt, idx)=>{
    const btn = el("button","option-button",{type:"button","data-key":String(idx+1)}, opt);
    if (selectedOption) {
      btn.disabled = true;
      if (opt===selectedOption) btn.classList.add("selected");
      if (!examMode && els.feedback.checked) {
        if (opt===item.correct) btn.classList.add("correct");
        if (opt===selectedOption && opt!==item.correct) btn.classList.add("incorrect");
      }
    }
    addTap(btn, function(){ choose(opt); });
    card.appendChild(btn);
  });

  if(item.ref) card.appendChild(el("div","q-ref",{}, `Reference: ${item.ref}`));

  const notesBox = el("div","notes",{});
  const ta = el("textarea","",{placeholder:"Personal notes (saved locally per question)..."});
  ta.value = getNotes(item.qNum); ta.addEventListener("input", ()=>saveNotes(item.qNum, ta.value));
  notesBox.appendChild(ta); card.appendChild(notesBox);

  const nav = el("div","nav-buttons",{});
  const back = mkBtn("⬅ Back", ()=>{ current = Math.max(0, current-1); renderQuiz(); }, (current===0 || examMode));
  const next = mkBtn(current+1===active.length?"Finish":"Next ➡", ()=>{ if (current+1===active.length){ testComplete=true; } else { current++; } renderQuiz(); }, false);
  const end = mkBtn("End Quiz", ()=>{ testComplete=true; renderQuiz(); });
  nav.append(back,next,end); card.appendChild(nav);

  els.quiz.appendChild(card);
  card.querySelector('.bookmark')?.addEventListener('click', ()=>{ toggleBookmark(item.qNum); renderQuiz(); });
}

function choose(opt){
  const item = active[current];
  const isCorrect = opt===item.correct;
  answers[current] = { qNum:item.qNum, q:item.q, selected:opt, correct:item.correct, isCorrect, ref:item.ref||"" };
  updateQStats(item.qNum, isCorrect);
  if(!isCorrect){ if(!missed.find(m=>m.qNum===item.qNum)) missed.push(answers[current]); }
  else { missed = missed.filter(m=>m.qNum!==item.qNum); }
  updateSR(item.qNum, isCorrect);
  selectedOption = opt; renderQuiz();
}

function resetQuiz(){
  answers=[]; missed=[]; current=0; testComplete=false; selectedOption=null;
  els.quiz.innerHTML = '<div class="panel review"><strong>Reset.</strong> Click <em>Start Quiz</em> to begin.</div>';
  els.progressWrap.hidden = true; stopTimer();
}

function showDashboard(){
  const total = answers.filter(Boolean).length;
  const correct = answers.filter(function(a){return a && a.isCorrect;}).length;
  const scorePct = total ? Math.round((correct/total)*100) : 0;

  appendHistory({ ts:Date.now(), mode: examMode?'exam':'quiz', total, correct, durationSec: getDurationEstimate() });
  renderAnalytics();

  els.progressBar.style.width="100%"; els.progressBar.setAttribute("aria-valuenow","100");

  const wrap = el("section","panel",{});
  wrap.innerHTML = `
    <h2>Quiz Complete — Review</h2>
    <div class="summary">
      <div><h3>Score</h3><div class="pill">${correct}/${total} • ${scorePct}%</div></div>
      <div><h3>Missed</h3><div class="pill">${missed.length}</div></div>
      ${timerActive ? `<div><h3>Time</h3><div class="pill">Time up</div></div>` : ``}
    </div>
    <div class="dashboard-actions">
      <button class="btn" id="reviewMissedBtn" ${missed.length?"":"disabled"}>Review missed only</button>
      <button class="btn btn-secondary" id="newQuizBtn">New quiz</button>
      <button class="btn btn-secondary" id="downloadBtn">Download CSV</button>
      <button class="btn btn-secondary" id="printBtn">Print</button>
    </div>`;
  answers.forEach((ans,i)=>{
    const d = el("div","question-card review",{});
    d.innerHTML = `
      <strong>Q${ans.qNum} (Quiz #${i+1})</strong><br/>
      ${ans.q}<br/>
      <span style="color:${ans.isCorrect?'#1a9d55':'#c73535'};font-weight:700">Your answer: ${ans.selected}</span><br/>
      <span style="color:#1a9d55">Correct: ${ans.correct}</span><br/>
      ${ans.ref ? `<span class="q-ref">Reference: ${ans.ref}</span>` : ""}`;
    wrap.appendChild(d);
  });
  els.quiz.innerHTML = ""; els.quiz.appendChild(wrap);

  byId("reviewMissedBtn")?.addEventListener("click", ()=>{
    if(!missed.length) return;
    const set = new Set(missed.map(m=>m.qNum));
    active = questions.filter(q=>set.has(q.qNum));
    current=0; answers=[]; testComplete=false; selectedOption=null;
    els.progressWrap.hidden=false;
    if (els.timerToggle.checked) startTimer(+els.timerMinutes.value || (examMode?60:20));
    renderQuiz();
  });
  byId("newQuizBtn")?.addEventListener("click", ()=>startQuiz(false));
  byId("downloadBtn")?.addEventListener("click", downloadCSV);
  byId("printBtn")?.addEventListener("click", ()=>window.print());
}

function renderAnalytics(){
  const hist=getHistory();
  const qstats=getQStats();
  const totalSessions=hist.length;
  const avgScore= totalSessions ? Math.round(hist.reduce((a,h)=>a+(h.correct/h.total),0)/totalSessions*100) : 0;
  const topMissed = Object.entries(qstats).sort((a,b)=>(b[1].wrong||0)-(a[1].wrong||0)).slice(0,5);
  els.analytics.innerHTML = `
    <div class="tile"><h3>Avg Score</h3><div>${avgScore}%</div></div>
    <div class="tile"><h3>Most Missed</h3><div>${topMissed.map(([q,s])=>`Q${q}: ${s.wrong||0}`).join('<br/>')||'—'}</div></div>
  `;
}

function downloadCSV(){
  const rows = [["Quiz#","Source Q#","Question","Selected","Correct","IsCorrect","Reference"]];
  answers.forEach((a,i)=>rows.push([i+1, a.qNum, (a.q||"").replaceAll(","," "), a.selected, a.correct, a.isCorrect?"TRUE":"FALSE", a.ref||""]));
  const csv = rows.map(r=>r.join(",")).join("\n");
  const blob = new Blob([csv],{type:"text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href=url; a.download=`54HS-UH1N-MQF-results.csv`; a.click(); URL.revokeObjectURL(url);
}

function startFlashcards(){
  if(!questions.length){ els.quiz.innerHTML='<div class="panel review">No questions available.</div>'; return; }
  flashMode=true; examMode=false; stopTimer(); els.progressWrap.hidden=true;

  let pool = questions.slice();
  if(els.favoritesOnly && els.favoritesOnly.checked){
    const favs=getBookmarks(); pool = pool.filter(q=>favs.has(q.qNum));
    if(!pool.length){ els.quiz.innerHTML = '<div class="panel review">No favorites yet. Star some questions first.</div>'; return;}
  }
  const dueList = pool.filter(q=>isDue(q.qNum));
  const remainder = pool.filter(q=>!isDue(q.qNum));
  const count = Math.max(1, Math.min(+els.qCount.value||pool.length, pool.length));

  let deck = dueList.slice();
  if(deck.length < count) deck = deck.concat(remainder.slice(0, count-deck.length));
  deck = (els.shuffle.checked) ? seededShuffle(deck, els.seedInput.value.trim()||null) : deck;

  flashQueue = deck.slice(0, count);
  flashIndex=0; flashShowingBack=false; testComplete=false;
  renderFlashcard(); els.main.focus();
}

function renderFlashcard(){
  const total = flashQueue.length;
  const item = flashQueue[flashIndex];
  if(!item){ showFlashSummary(); return; }

  els.quiz.innerHTML="";
  const wrap = el("section","flashcard-wrap",{});
  const meta = el("div","flashcard-meta",{}, `<span>Card ${flashIndex+1} / ${total} ${bookmarkStar(item.qNum)}</span>`);
  wrap.appendChild(meta);

  const face = el("div", flashShowingBack?"flashcard-back":"flashcard-front", {});
  face.innerHTML = flashShowingBack
    ? `<div><div style="font-weight:700;margin-bottom:8px;">Answer</div><div>${item.correct}</div>${item.ref?`<div class="q-ref" style="margin-top:10px">Reference: ${item.ref}</div>`:""}</div>`
    : `<div>${item.q}</div>`;
  wrap.appendChild(face);

  const actions = el("div","flashcard-actions",{});
  const flip = mkBtn(flashShowingBack ? "Show Question" : "Reveal Answer", ()=>{ flashShowingBack=!flashShowingBack; renderFlashcard(); });
  const wrong = mkBtn("Again ⟵", ()=>markFlash(false)); wrong.classList.add("btn-bad");
  const right = mkBtn("Got it ⟶", ()=>markFlash(true)); right.classList.add("btn-good");
  actions.append(flip, wrong, right);
  wrap.appendChild(actions);

  const tools = el("div","notes",{});
  const ta = el("textarea","",{placeholder:"Personal notes (saved locally per question)..."}); ta.value = getNotes(item.qNum);
  ta.addEventListener("input", ()=>saveNotes(item.qNum, ta.value));
  tools.appendChild(ta); wrap.appendChild(tools);

  els.quiz.appendChild(wrap);
  wrap.querySelector('.bookmark')?.addEventListener('click', ()=>{ toggleBookmark(item.qNum); renderFlashcard(); });
}

function markFlash(correct){
  const item = flashQueue[flashIndex];
  updateSR(item.qNum, correct);
  flashQueue.splice(flashIndex,1);
  const insertAt = correct ? Math.min(flashIndex+2, flashQueue.length) : Math.min(flashIndex+1, flashQueue.length);
  flashQueue.splice(insertAt,0,item);
  if(flashIndex >= flashQueue.length-1) flashIndex = 0; else flashIndex++;
  flashShowingBack=false; renderFlashcard();
}

function showFlashSummary(){
  testComplete=true;
  els.quiz.innerHTML = `
    <section class="panel">
      <h2>Flashcards — Session End</h2>
      <p class="q-ref">Deck updated using spaced repetition. Cards marked “Again” are due sooner.</p>
      <div class="dashboard-actions">
        <button class="btn" id="restartFlash">Restart Flashcards</button>
        <button class="btn btn-secondary" id="backToQuiz">Back to Quiz</button>
        <button class="btn btn-secondary" id="printBtn">Print</button>
      </div>
    </section>`;
  byId("restartFlash")?.addEventListener("click", ()=>{ testComplete=false; startFlashcards(); });
  byId("backToQuiz")?.addEventListener("click", ()=>{ flashMode=false; els.quiz.innerHTML = '<div class="panel review">Ready for a quiz. Adjust settings, then click <em>Start Quiz</em>.</div>'; });
  byId("printBtn")?.addEventListener("click", ()=>window.print());
}

function getBookmarks(){
  try{ return new Set(JSON.parse(localStorage.getItem(STORE.marks)||"[]")); }catch{ return new Set(); }
}
function setBookmarks(set){ try{ localStorage.setItem(STORE.marks, JSON.stringify([...set])); }catch(_e){} }
function toggleBookmark(qNum){ const s=getBookmarks(); if(s.has(qNum)) s.delete(qNum); else s.add(qNum); setBookmarks(s); }
function bookmarkStar(qNum){ const s=getBookmarks(); const on=s.has(qNum); return `<span class="bookmark" title="Bookmark">${on?'⭐':'☆'}</span>`; }

function getNotesMap(){
  try{ return JSON.parse(localStorage.getItem(STORE.notes)||"{}"); }catch{ return {}; }
}
function getNotes(qNum){ const m=getNotesMap(); return m[qNum]||""; }
function saveNotes(qNum, text){ const m=getNotesMap(); m[qNum]=text; try{ localStorage.setItem(STORE.notes, JSON.stringify(m)); }catch(_e){} }

function getSR(){
  try{ return JSON.parse(localStorage.getItem(STORE.srDeck)||"{}"); }catch{ return {}; }
}
function setSR(deck){ try{ localStorage.setItem(STORE.srDeck, JSON.stringify(deck)); }catch(_e){} }
function isDue(qNum){ const d=getSR()[qNum]; return !d || (Date.now() >= (d.due||0)); }
function updateSR(qNum, correct){
  const deck=getSR(); const cur=deck[qNum]||{level:1,due:0,laps:0};
  if(correct) cur.level=Math.min(cur.level+1,5); else cur.level=Math.max(cur.level-1,1);
  cur.laps++;
  const days=[0,1,2,4,7,14][cur.level]||1;
  const next=new Date(); next.setDate(next.getDate()+days);
  cur.due = next.getTime(); deck[qNum]=cur; setSR(deck);
}

function getQStats(){
  try{ return JSON.parse(localStorage.getItem(STORE.qStats)||"{}"); }catch{ return {}; }
}
function setQStats(m){ try{ localStorage.setItem(STORE.qStats, JSON.stringify(m)); }catch(_e){} }
function updateQStats(qNum, correct){
  const m=getQStats(); const s=m[qNum]||{seen:0,correct:0,wrong:0,last:0};
  s.seen++; if (correct) s.correct++; else s.wrong++; s.last=Date.now(); m[qNum]=s; setQStats(m);
}
function getHistory(){
  try{ return JSON.parse(localStorage.getItem(STORE.history)||"[]"); }catch{ return []; }
}
function setHistory(h){ try{ localStorage.setItem(STORE.history, JSON.stringify(h)); }catch(_e){} }
function appendHistory(entry){ const h=getHistory(); h.push(entry); setHistory(h); }
function getDurationEstimate(){ if(els.timerToggle.checked) return (+els.timerMinutes.value||0)*60 - remainingSeconds; return 0; }

function handleKeys(e){
  if (flashMode && flashQueue.length && !testComplete){
    if (e.key === " "){ e.preventDefault(); flashShowingBack=!flashShowingBack; renderFlashcard(); return; }
    if (e.key === "ArrowRight"){ e.preventDefault(); markFlash(true); return; }
    if (e.key === "ArrowLeft"){ e.preventDefault(); markFlash(false); return; }
  }
  if (!active.length || testComplete) return;
  if (e.key>="1" && e.key<="4"){ const idx=+e.key-1; const opt=active[current]?.options[idx]; if (opt && !answers[current]) choose(opt); }
  if (e.key==="ArrowRight"){ if (active.length){ if (current+1===active.length){ testComplete=true; renderQuiz(); } else { current++; renderQuiz(); } } }
  if (e.key==="ArrowLeft" && !examMode){ if (current>0){ current--; renderQuiz(); } }
  if (e.key==="Enter"){ if (active.length){ if (current+1===active.length){ testComplete=true; renderQuiz(); } else { current++; renderQuiz(); } } }
}

function byId(id){ return document.getElementById(id); }
function el(tag, cls, attrs={}, html){ const n=document.createElement(tag); if(cls) n.className=cls; for(const k in attrs){ n.setAttribute(k, attrs[k]); } if (html!=null) n.innerHTML=html; return n; }
function mkBtn(label, onClick, disabled=false){ const b=el("button", disabled?"btn btn-secondary":"btn", {}, label); b.disabled=!!disabled; addTap(b, onClick); return b; }
