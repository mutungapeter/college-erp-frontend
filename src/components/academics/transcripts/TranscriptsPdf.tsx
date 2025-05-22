import { TranscriptType } from "@/definitions/transcripts";
import { CustomDate } from "@/utils/date";
import {
  Document,
  Image,
  Page,
  PDFViewer,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    borderColor: "#6b7280",
    borderWidth: 2,
    fontFamily: "Helvetica",
  },
  logoSection: {
    marginBottom: 15,
    flexDirection: "column",
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  universityHeaderText: {
    alignItems: "center",
  },
  universityName: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 3,
  },
  contactInfo: {
    fontSize: 8,
    textAlign: "center",
    marginBottom: 2,
    lineHeight: 1.2,
  },
  officeTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 3,
  },
  documentType: {
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#6b7280",
    paddingBottom: 10,
    flexDirection: "column",
    alignItems: "center",
  },
  schoolName: {
    fontSize: 16,
    fontWeight: "bold",

    textAlign: "center",
  },
  documentTitle: {
    fontSize: 14,
    fontWeight: "bold",

    marginTop: 5,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 10,

    marginTop: 2,
    textAlign: "center",
  },
  studentSection: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#6b7280",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  semesterInfo: {
    padding: 8,
    borderRadius: 4,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 5,
    marginBottom: 8,
    color: "#6b7280",
  },
  infoSection: {
    flexDirection: "column",
    gap: 10,
  },
  infoRow: {
    flexDirection: "row",
    gap: 5,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  averageLabel: {
    fontSize: 10,
    fontWeight: "bold",
  },
  value: {
    fontSize: 10,
    fontWeight: "normal",
    textTransform: "uppercase",
  },
  courseSection: {
    marginTop: 25,
    borderWidth: 1,
    borderColor: "#6b7280",
    borderRadius: 4,
  },

  coursesHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    borderLeftWidth: 1,
    borderLeftColor: "#e5e7eb",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  courseCode: {
    width: "15%",
    fontSize: 9,
    fontWeight: "semibold",
    paddingVertical: 4,
    paddingHorizontal: 4,
    textAlign: "left",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },

  courseName: {
    width: "40%",
    fontSize: 9,
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 4,
    textAlign: "left",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },
  marks: {
    width: "10%",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },

  grade: {
    width: "10%",
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 4,
    paddingHorizontal: 4,
  },

  courseRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    borderLeftWidth: 1,
    borderLeftColor: "#e5e7eb",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },

  courseDataCode: {
    width: "15%",
    fontSize: 8,
    paddingVertical: 6,
    paddingHorizontal: 4,
    textAlign: "left",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
  },

  courseDataName: {
    width: "40%",
    fontSize: 8,
    textAlign: "left",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },

  courseDataMarks: {
    width: "10%",
    fontSize: 8,
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#e5e7eb",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },

  courseDataGrade: {
    width: "10%",
    fontSize: 8,
    textAlign: "center",
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  summary: {
    marginTop: 15,
    padding: 8,
    borderRadius: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    paddingTop: 5,
    borderTopWidth: 1,

    fontSize: 10,
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 10,
    fontSize: 8,
    color: "#6b7280",
    textAlign: "center",
  },
  signature: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureLine: {
    width: "40%",
    borderTopWidth: 1,

    marginHorizontal: "5%",
    textAlign: "center",
    paddingTop: 5,
    fontSize: 8,
  },
  gradingSection: {
    marginTop: 20,
    flexDirectionrow: "row",
    justifyContent: "space-between",
  },
  gradingSummary: {
    // marginTop: 20,
    flexDirection: "column",
    // width: '40%',
    // alignItems: 'flex-start',
  },

  gradingSummaryTitle: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "left",
    marginBottom: 8,
  },

  gradingTableHeader: {
    flexDirection: "row",
    paddingVertical: 4,
    marginBottom: 2,
  },
  gradingHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "left",
  },

  gradingPointsColumn: {
    // width: 60, // Fixed width instead of percentage
    paddingRight: 15,
  },

  gradingGradeColumn: {
    // width: 30,
  },

  gradingRow: {
    flexDirection: "row",
    paddingVertical: 2,
  },

  gradingRowLast: {
    flexDirection: "row",
    paddingVertical: 2,
  },

  gradingDataPoints: {
    // width: 60,
    fontSize: 8,
    textAlign: "left",
    paddingRight: 15,
  },

  gradingDataGrade: {
    // width: 30,
    fontSize: 8,
    textAlign: "left",
  },
});
interface Props {
  transcriptData: TranscriptType[];
}

const TranscriptPDF = ({ transcriptData }: Props) => {
  console.log("transcriptData======================", transcriptData);
  const gradingData = [
    { points: "70-100", grade: "A" },
    { points: "60-69", grade: "B" },
    { points: "50-59", grade: "C" },
    { points: "40-49", grade: "D" },
    { points: "0-39", grade: "E" },
  ];
  // const otherGradingDataKeys = [
  //   { symbol: "#", name: "Audited Unit" },
  //   { symbol: "*", name: "Supplementary" },
  //   { symbol: "**", name: "Retake" },
  //   { symbol: "-", name: "Missing Marks" },
  //   { symbol: "CT", name: "Credit Transfer" },
  //   { symbol: "I", name: "Incomplete Marks" },
  //   { symbol: "N/A", name: "Mark Type Not Applicable" },
  // ];

  return (
    <Document>
      {transcriptData?.map((transcript: TranscriptType, index: number) => {
        return (
          <Page size="A4" style={styles.page}
          key={index}
          >
            <View style={styles.logoSection}>
              <View style={styles.logoContainer}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image style={styles.logo}
                 src="/logo/university_logo.png"
                  // alt="Kathangaita University of Science and Technology Logo"
                 />
                <View style={styles.universityHeaderText}>
                  <Text style={styles.universityName}>
                    Kathangaita Unisversity  of Science and Technology
                  </Text>
                </View>
              </View>
              <Text style={styles.contactInfo}>P.O. BOX. 190-50100 Kathangaita,</Text>
              <Text style={styles.contactInfo}>
                TEL: +057-250523646/3,0745535335, FAX: +056-30150
              </Text>
              <Text style={styles.contactInfo}>
                Email: info@kaust.ac.ke, web: www.kaust.ac.ke
              </Text>
              <Text style={styles.officeTitle}>
                OFFICE OF THE REGISTRAR - ACADEMICS
              </Text>
              <Text style={styles.documentType}>
                Provisional Transcripts / Result Slip
              </Text>
            </View>

            <View style={styles.studentSection}>
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Student Name:</Text>
                  <Text style={styles.value}>
                    {transcript?.student?.user.first_name}{" "}
                    {transcript?.student?.user.last_name}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Programme:</Text>
                  <Text style={styles.value}>
                    {transcript?.student?.programme.name}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Department:</Text>
                  <Text style={styles.value}>
                    {transcript?.student?.programme?.department.name}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>FacuLTY:</Text>
                  <Text style={styles.value}>
                    {transcript?.student?.programme?.department.school.name}
                  </Text>
                </View>
              </View>
              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Reg. Number:</Text>
                  <Text style={styles.value}>
                    {transcript?.student?.registration_number}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Year Of study:</Text>
                  <Text style={styles.value}>{transcript?.student?.cohort.current_year}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Semester:</Text>
                  <Text style={styles.value}>{transcript?.student?.cohort.current_semester.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Admission Year:</Text>
                  <Text style={styles.value}>{CustomDate(transcript?.student?.created_on)}</Text>
                </View>
              </View>
            </View>

            {/* Course Marks */}
            <View>
              <View style={styles.coursesHeader}>
                <Text style={styles.courseCode}>Code</Text>
                <Text style={styles.courseName}>Course Name</Text>
                <Text style={styles.marks}>CAT 1</Text>
                <Text style={styles.marks}>CAT 2</Text>
                <Text style={styles.marks}>Exam</Text>
                <Text style={styles.marks}>Total</Text>
                <Text style={styles.grade}>Grade</Text>
              </View>

              {/* Course Rows */}
              {transcript?.marks?.map((course) => (
                <View key={course.id} style={styles.courseRow}>
                  <Text style={styles.courseDataCode}>
                    {course.course.course_code}
                  </Text>
                  <Text style={styles.courseDataName}>
                    {course.course.name}
                  </Text>
                  <Text style={styles.courseDataMarks}>{course.cat_one}</Text>
                  <Text style={styles.courseDataMarks}>{course.cat_two}</Text>
                  <Text style={styles.courseDataMarks}>
                    {course.exam_marks}
                  </Text>
                  <Text style={styles.courseDataMarks}>
                    {course.total_marks}
                  </Text>
                  <Text style={styles.courseDataGrade}>{course.grade}</Text>
                </View>
              ))}
            </View>

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.averageLabel}>Total Units:</Text>
                <Text style={styles.value}>{transcript?.marks?.length}</Text>
              </View>
            </View>
            <View style={styles.gradingSection}>
              <View style={styles.gradingSummary}>
                <Text style={styles.gradingSummaryTitle}>
                  Key Grading System
                </Text>

                <View style={styles.gradingTableHeader}>
                  <Text
                    style={[
                      styles.gradingHeaderText,
                      styles.gradingPointsColumn,
                    ]}
                  >
                    Points
                  </Text>
                  <Text
                    style={[
                      styles.gradingHeaderText,
                      styles.gradingGradeColumn,
                    ]}
                  >
                    Grade
                  </Text>
                </View>

                {gradingData.map((item, index) => (
                  <View
                    key={index}
                    style={
                      index === gradingData.length - 1
                        ? styles.gradingRowLast
                        : styles.gradingRow
                    }
                  >
                    <Text style={styles.gradingDataPoints}>{item.points}</Text>
                    <Text style={styles.gradingDataGrade}>{item.grade}</Text>
                  </View>
                ))}
              </View>
              {/* <View style={styles.gradingSummary}>
                <Text style={styles.gradingSummaryTitle}>Other Keys</Text>

                <View style={styles.gradingTableHeader}>
                  <Text
                    style={[
                      styles.gradingHeaderText,
                      styles.gradingPointsColumn,
                    ]}
                  >
                    Symbol
                  </Text>
                  <Text
                    style={[
                      styles.gradingHeaderText,
                      styles.gradingGradeColumn,
                    ]}
                  >
                    Name
                  </Text>
                </View>

                {otherGradingDataKeys.map((item, index) => (
                  <View
                    key={index}
                    style={
                      index === otherGradingDataKeys.length - 1
                        ? styles.gradingRowLast
                        : styles.gradingRow
                    }
                  >
                    <Text style={styles.gradingDataPoints}>{item.symbol}</Text>
                    <Text style={styles.gradingDataGrade}>{item.name}</Text>
                  </View>
                ))}
              </View> */}
            </View>

            <View style={styles.signature}>
              <View style={styles.signatureLine}>
                <Text>Registrar</Text>
              </View>
              <View style={styles.signatureLine}>
                <Text>Dean of Studies</Text>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text>
                This is an official transcript of the Kathangaita Unisversity  of Science and Technology.
              </Text>
              <Text>This document is void if altered in any way.</Text>
            </View>
          </Page>
        );
      })}
    </Document>
  );
};

export const PDFTranscriptViewer = ({ transcriptData }: Props) => {
  console.log("transcriptData======================", transcriptData);
  return (
    <PDFViewer width="100%" height="100%" className="border-0">
      <TranscriptPDF transcriptData={transcriptData} />
    </PDFViewer>
  );
};

export default TranscriptPDF;
