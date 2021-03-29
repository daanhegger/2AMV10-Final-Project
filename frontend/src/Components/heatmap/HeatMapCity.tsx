import React, { useCallback, useEffect } from "react";
import * as d3 from "d3";
import geojson from "../../data/cityMap.json";
import { GeoPermissibleObjects } from "d3";

const classNameSafe = (nh: string) => nh.split(/\s+/).join("");

interface Props {
  size?: number;
  baseColor: string;
  data: { neighbourhood: string; messages: number }[];
  maxFrequency: number;
  onSelect(neighbourhood: string | null): void;
  selectedNH: string | null;
}

const HeatMapCity: React.FC<Props> = ({ size = 600, baseColor, onSelect, selectedNH, data, maxFrequency }) => {
  const svgId = randomId();
  const selector = "svg#" + svgId;

  useEffect(() => {
    const handleClick = (e: any) => {
      const neighbourhood = e.path[0].getAttribute("data-nh");
      onSelect(neighbourhood);
    };

    const getOpacity = (nh: string) => {
      const dataRow = data.find((row) => row.neighbourhood === nh);

      const minOpacity = 0.3;

      if (!dataRow) {
        return minOpacity;
      }
      const opacity = (dataRow.messages / maxFrequency) * (1 - minOpacity);

      return Math.max(opacity + minOpacity, minOpacity);
    };

    const getAmountLabel = (nh: string) => {
      const dataRow = data.find((row) => row.neighbourhood === nh);
      return `(${dataRow?.messages || "0"} tweets)`;
    };

    const width = size;
    const height = size;

    const svg = document.querySelector<SVGElement>(selector);
    if (svg) {
      svg.style.width = width.toString();
      svg.style.height = height.toString();
    }

    const projection = d3.geoMercator().scale(1).translate([0, 0]);

    const geoGenerator = d3.geoPath().projection(projection);

    var b = geoGenerator.bounds(geojson as GeoPermissibleObjects);
    const s = 0.85 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height);
    const t: [number, number] = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

    projection.scale(s).translate(t);

    let map = d3.select(selector).selectAll("path").data(geojson.features);

    map
      .enter()
      .append("path")
      .attr("data-nh", (d) => d.properties.Nbrhood)
      .attr("class", (d) => "nhpath " + classNameSafe(d.properties.Nbrhood))
      .attr("d", geoGenerator as any)
      .on("click", handleClick);

    /**
     * Set labels per region with name and count
     */
    map
      .enter()
      .append("svg:text")
      .text(function (neighbourhoodFeature: any) {
        return neighbourhoodFeature.properties.Nbrhood;
      })
      .attr("x", function (neighbourhoodFeature: any) {
        return geoGenerator.centroid(neighbourhoodFeature)[0];
      })
      .attr("y", function (neighbourhoodFeature: any) {
        return geoGenerator.centroid(neighbourhoodFeature)[1];
      })
      .attr("text-anchor", "middle")
      .attr("fill", (nhf) => (getOpacity(nhf.properties.Nbrhood) < 0.5 ? "white" : "black"))
      .attr("font-family", "sans-serif")
      .attr("font-size", "6pt");

    map
      .enter()
      .append("svg:text")
      .text(function (neighbourhoodFeature: any) {
        const targetRow = data.find((row) => row.neighbourhood === neighbourhoodFeature.properties.Nbrhood);
        return `(${targetRow?.messages || "0"} tweets)`;
      })
      .attr("x", function (neighbourhoodFeature: any) {
        return geoGenerator.centroid(neighbourhoodFeature)[0];
      })
      .attr("y", function (neighbourhoodFeature: any) {
        return geoGenerator.centroid(neighbourhoodFeature)[1] + 10;
      })
      .attr("text-anchor", "middle")
      .attr("fill", (nhf) => (getOpacity(nhf.properties.Nbrhood) < 0.5 ? "white" : "black"))
      .attr("font-family", "sans-serif")
      .attr("font-size", "6pt")
      .attr("class", "svg-text-amounts");

    function update(geojson: any) {
      var u = d3.select(selector).select("g.map").selectAll("path").data(geojson.features);

      u.enter()
        .append("path")
        .attr("d", geoGenerator as any);
    }

    update(geojson);

    setTimeout(() => {
      /**
       * Change the opacity based on the amount of messages
       */
      d3.select(selector)
        .selectAll(".nhpath")
        .style("fill", baseColor)
        .style("stroke-width", "0.7")
        .style("stroke", "black")
        .style("fill-opacity", (neighbourhoodFeature: any) => {
          const nh = neighbourhoodFeature.properties.Nbrhood;
          return getOpacity(nh);
        });

      /**
       * Draw indicator borders around the currenly selected neighbourhood
       */
      if (selectedNH) {
        d3.select(selector)
          .select(`.${classNameSafe(selectedNH)}`)
          .style("stroke-width", "3")
          .style("stroke", "yellow");
      } else {
        d3.select(selector).selectAll(`.nhpath`).style("stroke-width", "0.7").style("stroke", "black");
      }

      /**
       * Update the amount label when the data changes
       */
      d3.select(selector)
        .selectAll(".svg-text-amounts")
        .text((neighbourhoodFeature: any) => getAmountLabel(neighbourhoodFeature.properties.Nbrhood));
    }, 100);

    update(geojson);
  }, [selector, size, baseColor, selectedNH, onSelect, data, maxFrequency]);

  return (
    <svg id={svgId} width="400px" height="400px">
      <g className="map"></g>
    </svg>
  );
};

export default HeatMapCity;

/**
 * Generate a random string id
 */
const randomId = () => `abc_${Math.floor(Math.random() * 1000)}`;
