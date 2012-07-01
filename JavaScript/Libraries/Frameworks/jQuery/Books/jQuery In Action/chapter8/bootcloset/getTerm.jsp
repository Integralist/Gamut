<c:set var="term" value="${fn:toLowerCase(param.term)}"/>
<c:choose>
  <c:when test="${term=='oil-tanned'}">
    A method of leather tanning in where oils or fats are used to cure the leather. Such leather usually very supple and has a matte or "oily" finish and is not generally polishable.
  </c:when>
  <c:when test="${term=='full-grain'}">
    Leather which has not been altered beyond hair removal. Full-grain leather is the most genuine type of leather, as it retains all of the original texture and markings of the original hide.
  </c:when>
  <c:when test="${term=='vibram'}">
    A brand of boot and shoe sole created by Vitale Bramani in the 1930's, orginally for climbing boots. The Vibram&reg; brand is recognized worldwide as the leader in high performance soling products for outdoor, dress casual, and service footwear.
  </c:when>
  <c:when test="${term=='goodyear welt'}">
    The Goodyear welt is a method of attaching the sole of a shoe to the upper that is  hand-stitched and allows multiple sole replacements, extending the life of the footwear.
  </c:when>
  <c:when test="${term=='cambrelle'}">
     A non-woven synthetic fabric used primarily as a lining for shoes, boots and slippers.
  </c:when>
  <c:when test="${term=='cordura'}">
    A certified fabric from INVISTA used in a wide range of products from luggage and backpacks to boots, to military wear and performance apparel. Cordura� is resistant to abrasions, tears and scuffs.
  </c:when>
  <c:when test="${term=='gore-tex'}">
    A water-proof and breathable fabric that offers superior insulating abilities in a light-weight fabric.
  </c:when>
  <c:when test="${term=='stitch-down'}">
    A method of boot construction that helps seal the boot against dirt, mud, and water and maximizes flexibility.
  </c:when>
  <c:otherwise>
    Unknown term.
  </c:otherwise>
</c:choose>