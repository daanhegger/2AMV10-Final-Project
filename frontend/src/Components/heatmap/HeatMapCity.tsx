import React, { useEffect } from "react";
import * as d3 from "d3";
import geojson from "../../data/cityMap.json";
import { GeoPermissibleObjects } from "d3";

interface Props {
  size?: number;
  baseColor: string;
}

const HeatMapCity: React.FC<Props> = ({ size = 600, baseColor }) => {
  const svgId = randomId();
  const selector = "svg#" + svgId;

  useEffect(() => {
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
      .attr("class", "nhpath")
      .attr("d", geoGenerator as any);

    map
      .enter()
      .append("svg:text")
      .text("regel 1")
      .attr("x", function (neighbourhoodFeature: any) {
        return geoGenerator.centroid(neighbourhoodFeature)[0];
      })
      .attr("y", function (neighbourhoodFeature: any) {
        return geoGenerator.centroid(neighbourhoodFeature)[1] + 10;
      })
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .attr("font-family", "sans-serif")
      .attr("font-size", "6pt");

    map
      .enter()
      .append("svg:text")
      .text(function (neighbourhoodFeature: any) {
        return neighbourhoodFeature.properties.Nbrhood + " (8 tweets)";
      })
      .attr("x", function (neighbourhoodFeature: any) {
        return geoGenerator.centroid(neighbourhoodFeature)[0];
      })
      .attr("y", function (neighbourhoodFeature: any) {
        return geoGenerator.centroid(neighbourhoodFeature)[1];
      })
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .attr("font-family", "sans-serif")
      .attr("font-size", "6pt");

    function update(geojson: any) {
      var u = d3.select(selector).select("g.map").selectAll("path").data(geojson.features);

      u.enter()
        .append("path")
        .attr("d", geoGenerator as any);
    }

    update(geojson);

    setTimeout(() => {
      d3.select(selector)
        .selectAll(".nhpath")
        .style("fill", baseColor)
        .style("stroke-width", "0.7")
        .style("stroke", "black")
        .style("fill-opacity", () => Math.random() / 2 + 0.5);
    }, 100);
  }, [selector, size, baseColor]);

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
