//waypoints scroll constructor
function scroll(n, offset, func1, func2) {
  return new Waypoint({
    element: document.getElementById(n),
    handler: function(direction) {
      direction == 'down' ? func1() : func2();
    },
    //start 75% from the top of the div
    offset: offset
  });
}

let padding = 100;
let dimension = 700;

let size = {
  container: {
    width: dimension,
    height: dimension
  },
  inset: {
    width: dimension - 2 * padding,
    height: dimension - 2 * padding
  }
};

d3.csv('aircraft_incidents.csv', function(data) {
  let csv = data.map(value => {
    return {
      accident_number: value.Accident_Number,
      date: value.Event_Date,
      location: value.Location,
      country: value.Country,
      lat: +value.Latitude,
      long: +value.Longitude,
      airport_code: value.Airport_Code,
      airport_name: value.Airport_Name,
      injury_severity: value.Injury_Severity,
      aircraft_damage: value.Aircraft_Damage,
      reg_num: value.Registration_Number,
      plane_make: value.Make,
      plane_model: value.Model,
      schedule: value.Schedule,
      carrier: value.Air_Carrier,
      fatal: +value.Total_Fatal_Injuries,
      serious: +value.Total_Serious_Injuries,
      uninjured: +value.Total_Uninjured,
      weather: value.Weather_Condition || 'UNK',
      flight_phase: value.Broad_Phase_of_Flight || 'UNKNOWN'
    };
  });

  let timeline = setupTimeline(csv);
  let allData = setupExplore(csv);

  function showTimeline() {
    timeline.show();
    allData.hide();
  }

  function showAllData() {
    timeline.hide();
    allData.show();
  }

  // initial setup
  showTimeline();
  timeline.all();

  //triger these functions on page scroll
  new scroll(
    'start',
    '0%',
    () => {
      showTimeline();
      timeline.all();
    },
    () => {
      showTimeline();
      timeline.all();
    }
  );

  new scroll(
    'bombardierAll',
    '50%',
    () => {
      showTimeline();
      timeline.bombardierAll();
    },
    () => {
      showTimeline();
      timeline.all();
    }
  );

  new scroll(
    'embraerAll',
    '50%',
    () => {
      showTimeline();
      timeline.embraerAll();
    },
    () => {
      showTimeline();
      timeline.bombardierAll();
    }
  );
  new scroll(
    'mcdonnellAll',
    '50%',
    () => {
      showTimeline();
      timeline.mcdonnellAll();
    },
    () => {
      showTimeline();
      timeline.embraerAll();
    }
  );
  new scroll(
    'airbusAll',
    '50%',
    () => {
      showTimeline();
      timeline.airbusAll();
    },
    () => {
      showTimeline();
      timeline.mcdonnellAll();
    }
  );
  new scroll(
    'boeingAll',
    '50%',
    () => {
      showTimeline();
      timeline.boeingAll();
    },
    () => {
      showTimeline();
      timeline.airbusAll();
    }
  );

  new scroll(
    'explore',
    '50%',
    () => {
      showAllData();
    },
    () => {
      showTimeline();
      timeline.boeingAll();
    }
  );
});
